export const dynamic = "force-dynamic";
import { isAdmin } from "../auth/[...nextauth]/checkAdmin";
import myDbConnection from "@/lib/myDbConnection";
import { Order } from "@/model/orders.model";

export async function GET() {
  try {
    let pipeLine = [];
    await myDbConnection();
    if (await isAdmin()) {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const startOfNextMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      );
      //console.log("---------- date: ", startOfMonth, " --: ", startOfNextMonth);
      pipeLine.push(
        {
          $match: {
            paid: true,
            // _id: ObjectId('664d9d3f587bca327de2a21f'),
            createdAt: {
              $gte: startOfMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $unwind: "$cartProducts",
        },
        {
          $addFields: {
            "cartProducts.totalPrice": {
              $add: [
                "$cartProducts.basePrice",
                {
                  $ifNull: ["$cartProducts.size.price", 0],
                },
                {
                  $reduce: {
                    input: {
                      $ifNull: ["$cartProducts.extras", []],
                    },
                    initialValue: 0,
                    in: {
                      $add: ["$$value", "$$this.price"],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            email: { $first: "$userEmail" },
            phone: { $first: "$mobile" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            totalPrice: {
              $sum: "$cartProducts.totalPrice",
            },
          },
        },
        {
          $project: {
            email: 1,
            phone: 1,
            createdAt: 1,
            updatedAt: 1,
            totalPrice: 1,
          },
        },
        {
          $sort: {
            createdAt: 1, // Sort by createdAt in descending order
          },
        }
      );

      const result = await Order.aggregate(pipeLine);
      if (!result) {
        return Response.json(
          { success: false, message: "result not found in bargraph" },
          { status: 400 }
        );
      }

      return Response.json(
        { success: true, message: "Data fetched!", data: result },
        { status: 200 }
      );
    }
    return Response.json({ success: false, message: "you are not authorized" });
  } catch (error) {
    console.error("error in barChart graph: ", error);
    throw error;
  }
}
