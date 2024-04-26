import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
export async function PUT(req) {
  try {
    await myDbConnection();
    const { name, mobile, Street, postCode, city, country } = await req.json();
    const session = await getServerSession(authOptions);
    const email = session.user?.email;
    const response = await UserModel.findOneAndUpdate(
      { email },
      { name, mobile, Street, postCode, city, country },
      { new: true }
    );
    if (response) {
      return Response.json({
        success: true,
        message: "record updated",
        data: {},
      });
    }
    return Response.json({
      success: false,
      message: "record not updated",
      data: {},
    });
  } catch (error) {
    console.log("error in api profile: ", error);
    return Response.json({
      success: false,
      message: error || "Error in profile api endpoint",
      data: {},
    });
  }
}

export async function GET() {
  await myDbConnection();
  const session = await getServerSession(authOptions);
  // console.log(mobile);
  const email = session?.user?.email;
  if (!email) {
    return Response.json({});
  }
  return Response.json(await UserModel.findOne({ email }));
}
