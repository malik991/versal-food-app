import myDbConnection from "@/lib/myDbConnection";
import { Order } from "@/model/orders.model";

export async function GET(req) {
  const url = new URL(req.url);
  const _id = url.searchParams.get("id");
  try {
    await myDbConnection();
    const res = await Order.findById(_id);
    return Response.json({ success: true, data: res });
  } catch (error) {
    console.log("error in order api: ", error);
    throw error;
  }
}
