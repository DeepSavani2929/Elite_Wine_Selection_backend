const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.js");
const Cart = require("../models/cart.js");

const webHookForPayment = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { orderId, cartId } = paymentIntent.metadata || {};

    if (!orderId) {
      console.log(" No orderId in metadata");
      return res.json({ received: true });
    }

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        console.log(" Order not found in DB");
        return res.json({ received: true });
      }

      order.payment.status = "paid";
      order.payment.paymentIntentId = paymentIntent.id;
      await order.save();

      console.log(` Order ${order.orderId} marked as PAID`);

      if (cartId) {
        const deleted = await Cart.deleteMany({ cartId });
        console.log(deleted);
        console.log(` Cart deleted count: ${deleted.deletedCount}`);
      } else {
        console.log("No cartId in metadata – cannot clear cart.");
      }

      return res.json({ received: true });
    } catch (err) {
      console.log("Webhook DB Error:", err.message);
      return res.json({ received: true });
    }
  }

  return res.json({ received: true });
};

module.exports = webHookForPayment;
