import myDbConnection from "@/lib/myDbConnection";
import UserModel from "@/model/user.model";
export async function GET() {
  try {
    await myDbConnection();
    const response = await UserModel.find();
    return Response.json({ success: true, data: response });
  } catch (error) {
    console.log("error in get all users");
    throw error;
  }
}
