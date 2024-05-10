import myDbConnection from "@/lib/myDbConnection";
import { Order } from "@/model/orders.model";

const stripe = require("stripe")(process.env.STRIPE_SK);

export async function POST(req) {
  const endpointSecret = process.env.STRIPE_SIGNIN_SECRET;
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    await myDbConnection();
    const reqBuffer = await req.text();
    event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret);
    if (event.type === "checkout.session.completed") {
      //console.log(event);
      const orderId = event?.data?.object?.metadata?.orderId;
      const isPaymentDone = event?.data?.object?.payment_status === "paid";
      if (isPaymentDone) {
        await Order.updateOne({ _id: orderId }, { paid: true });
      }
      //console.log("ordrid: ", orderId);
    }
    return Response.json(
      { status: 200 },
      { success: true, message: "payment success" }
    );
  } catch (err) {
    console.error("error in webhook of stripe: ", err);
    return Response.json(
      { sucess: false, message: err?.message || "Error on strip webhook api" },
      { status: 400 }
    );
  }
  //console.log("event shape: ", event);
}
