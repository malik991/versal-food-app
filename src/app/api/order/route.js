import myDbConnection from "@/lib/myDbConnection";
import { Order } from "@/model/orders.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const url = new URL(req.url);
  const _id = url.searchParams.get("id");
  let admin = await isAdmin();
  try {
    await myDbConnection();
    if (_id) {
      const res = await Order.findById(_id);
      return Response.json({ success: true, data: res });
    }
    if (admin) {
      return Response.json({
        success: true,
        data: await Order.find(),
      });
    }
    if (userEmail) {
      return Response.json({
        success: true,
        data: await Order.find({ userEmail }),
      });
    }
  } catch (error) {
    console.log("error in order api: ", error);
    throw error;
  }
}
