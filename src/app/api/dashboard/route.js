export const dynamic = "force-dynamic";

import { isAdmin } from "../auth/[...nextauth]/checkAdmin";
import myDbConnection from "@/lib/myDbConnection";
import { Order } from "@/model/orders.model";

export async function GET(req) {
  try {
    let pipeLine = [];
    await myDbConnection();
    if (await isAdmin()) {
      pipeLine.push(
        {
          $facet: {
            paidOrders: [
              {
                $match: { paid: true },
              },
              {
                $unwind: "$cartProducts",
              },
              {
                $addFields: {
                  "cartProducts.totalPrice": {
                    $add: [
                      "$cartProducts.basePrice",
                      { $ifNull: ["$cartProducts.size.price", 0] },
                      {
                        $reduce: {
                          input: { $ifNull: ["$cartProducts.extras", []] },
                          initialValue: 0,
                          in: { $add: ["$$value", "$$this.price"] },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$_id",
                  userEmail: { $first: "$userEmail" },
                  totalPrice: { $sum: "$cartProducts.totalPrice" },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSum: { $sum: "$totalPrice" },
                  totalPaidOrders: { $sum: 1 },
                },
              },
            ],
            allOrders: [
              {
                $count: "totalPaidAndUnpaidOrders",
              },
            ],
          },
        },
        {
          $project: {
            totalRevenue: { $arrayElemAt: ["$paidOrders.totalSum", 0] },
            totalPaidOrders: {
              $arrayElemAt: ["$paidOrders.totalPaidOrders", 0],
            },
            totalPaidAndUnpaidOrders: {
              $arrayElemAt: ["$allOrders.totalPaidAndUnpaidOrders", 0],
            },
          },
        }
      );
      const resut = await Order.aggregate(pipeLine);
      if (!resut) {
        return Response.json(
          {
            success: false,
            message: "order data not fetch for dashboard",
            data: {},
          },
          { status: 400 }
        );
      }

      return Response.json(
        { success: true, message: "data fetched successfully", data: resut[0] },
        { status: 200 }
      );
    }
    return Response.json({ success: false, message: "you are not authorised" });
  } catch (error) {
    console.log("error in fetch data for dashboard api: ", error);
    throw error;
  }
}
