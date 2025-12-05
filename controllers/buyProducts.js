const mongoose = require("mongoose");
const Order = require("../models/order.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const generateOrderId = async () => {
  const lastOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });

  let newNumber = 1;
  if (lastOrder?.orderId) {
    const match = lastOrder.orderId.match(/ORD-(\d{4})-(\d+)/);
    if (match) newNumber = parseInt(match[2], 10) + 1;
  }

  const year = new Date().getFullYear();
  return `ORD-${year}-${String(newNumber).padStart(6, "0")}`;
};

const buyProducts = async (req, res) => {
  try {
    const {
      cartId,
      contactInfo,
      deliveryAddress,
      billingAddress,
      cartItems,
      pricing,
      currency,
    } = req.body;

    if (!cartId) {
      return res.status(400).json({ message: "cartId is required" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!pricing || !pricing.totalAmount) {
      return res.status(400).json({ message: "Invalid pricing data" });
    }

    if (!currency) {
      return res.status(400).json({ message: "Currency is required" });
    }

    const currencyLower = currency.toLowerCase();
    const minimumCharge = { usd: 0.5, eur: 0.5, gbp: 0.3, inr: 1.0 };
    const minAllowed = minimumCharge[currencyLower] || 0.5;

    if (pricing.totalAmount < minAllowed) {
      return res.status(400).json({
        message: `Minimum charge is ${minAllowed} ${currency.toUpperCase()}`,
      });
    }

    const orderId = await generateOrderId();

    const orderPayload = {
      cartId,
      contactInfo,
      deliveryAddress,
      billingAddress,
      cartItems,
      pricing,
      orderId,
      payment: {
        status: "pending",
        currency: currencyLower,
      },
    };

    const newOrder = await Order.create(orderPayload);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pricing.totalAmount * 100),
      currency: currencyLower,
      payment_method_types: ["card"],
      metadata: {
        orderId: newOrder._id.toString(),
        orderNumber: orderId,
        emailOrPhone: contactInfo.emailOrPhone,
        cartId,
      },
    });

    newOrder.payment.paymentIntentId = paymentIntent.id;
    await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder.orderId,
    });
  } catch (err) {
    console.error("BuyProducts Error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Unexpected server error",
    });
  }
};

module.exports = buyProducts;
