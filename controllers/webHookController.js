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
    console.error(" Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const { orderId, userId } = paymentIntent.metadata || {};

    if (!orderId) {
      console.error(" No orderId in metadata.");
      return res.status(400).json({
        success: false,
        message: "Missing orderId metadata",
      });
    }

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        console.error(" Order not found:", orderId);
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      order.payment.status = "paid";
      order.payment.paymentIntentId = paymentIntent.id;
      await order.save();

      console.log(`Order ${order.orderId} marked as PAID.`);

      if (mongoose.Types.ObjectId.isValid(userId)) {
        const deleted = await Cart.deleteMany({ userId });

        console.log(
          deleted.deletedCount > 0
            ? ` Cart cleared for user ${userId}`
            : ` No cart items found for user ${userId}`
        );
      } else {
        console.log(" Guest checkout — no cart clearing required.");
      }

      return res.json({ received: true });
    } catch (err) {
      console.error(" Webhook DB Error:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  return res.json({ received: true });
};

module.exports = webHookForPayment;
