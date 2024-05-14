import myDbConnection from "@/lib/myDbConnection";
import UserModel from "@/model/user.model";
import { isAdmin } from "../auth/[...nextauth]/checkAdmin";

export async function GET() {
  try {
    await myDbConnection();
    if (await isAdmin()) {
      const response = await UserModel.find();
      return Response.json({ success: true, data: response });
    }
    return Response.json({ suceess: false, message: "you are not authorized" });
  } catch (error) {
    console.log("error in get all users");
    throw error;
  }
}
