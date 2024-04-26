import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
export async function PUT(req) {
  try {
    await myDbConnection();
    const { name } = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user?.email;
    const response = await UserModel.findOneAndUpdate(
      { email },
      { name },
      { new: true }
    );
    if (response) {
      return Response.json({
        success: true,
        message: "record updated",
        data: response,
      });
    }
    return Response.json({
      success: false,
      message: "record not updated",
      data: [],
    });
  } catch (error) {
    console.log("error in api profile: ", error);
    return Response.json({
      success: false,
      message: error || "Error in profile api endpoint",
      data: [],
    });
  }
}
