import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Order } from "../../../model/orders.model";
import MenuModel from "@/model/menuItems.model";
const stripe = require("stripe")(process.env.STRIPE_SK);
export async function POST(req) {
  const { address, cartProducts } = await req.json();
  try {
    await myDbConnection();
    const session = await getServerSession(authOptions);
    const userEmail = session.user?.email;
    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts,
      paid: false,
    });

    const stripeLineItems = [];

    for (const cartProduct of cartProducts) {
      const productInfo = await MenuModel.findById(cartProduct._id);
      console.log("product infoe: ", productInfo);
      let productPrice = productInfo.basePrice;
      if (cartProduct.size) {
        const size = productInfo.sizes.find(
          (size) => size._id.toString() === cartProduct.size._id.toString()
        );
        productPrice += size.price;
      }
      if (cartProduct.extras?.length > 0) {
        for (const cartProductExtraThing of cartProduct.extras) {
          const productExtras = productInfo.extraIngredients;
          const extraThingInfo = productExtras.find(
            (extra) =>
              extra._id.toString() === cartProductExtraThing._id.toString()
          );
          productPrice += extraThingInfo.price;
        }
      }
      const productName = cartProduct.name;
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: productName,
          },
          unit_amount: productPrice * 100,
        },
      });
    }

    // const stripeSession = await stripe.checkout.sessions.create({
    //   line_items: stripeLineItems,
    //   mode: "payment",
    //   customer_email: userEmail,
    //   success_url: process.env.NEXTAUTH_URL + "cart?success=1",
    //   cancel_url: process.env.NEXTAUTH_URL + "cart?canceled=1",
    //   metadata: { orderId: orderDoc._id },
    //   shipping_options: [
    //     {
    //       shipping_rate_data: {
    //         display_name: "Delivery fee",
    //         type: "fixed_amount",
    //         fixed_amount: { amount: 500, currency: "USD" },
    //       },
    //     },
    //   ],
    // });
    return Response.json({
      success: true,
      message: "provide category name",
      data: { orderDoc },
    });
  } catch (error) {
    console.log("error in checkout api: ", error);
    throw error;
  }
}
