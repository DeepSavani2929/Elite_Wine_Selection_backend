// const mongoose = require("mongoose");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/order.js");
// const Cart = require("../models/cart.js");

// const webHookForPayment = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object;

//     const { orderId, cartId } = paymentIntent.metadata || {};

//     if (!orderId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing orderId metadata" });
//     }

//     try {
//       const order = await Order.findById(orderId);
//       if (!order) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Order not found" });
//       }

//       order.payment.status = "paid";
//       order.payment.paymentIntentId = paymentIntent.id;
//       await order.save();

//       console.log(`Order ${order.orderId} marked as PAID.`);

//       if (cartId) {
//         const deleted = await Cart.deleteMany({ cartId });
//         console.log(
//           deleted.deletedCount > 0
//             ? `Cart cleared: ${cartId}`
//             : "No cart found for cartId"
//         );
//       } else {
//         console.log("No cartId provided, guest checkout - no cart clearing.");
//       }

//       return res.json({ received: true });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   return res.json({ received: true });
// };

// module.exports = webHookForPayment;



const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.js");
const Cart = require("../models/cart.js");

const webHookForPayment = async (req, res) => {
  console.log("fdsfs")
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

  console.log("Webhook received:", event.type);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { orderId, cartId } = paymentIntent.metadata || {};

    console.log("Metadata:", paymentIntent.metadata);
    console.log(cartId)

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
        console.log(deleted)
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
