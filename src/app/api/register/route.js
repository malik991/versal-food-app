import UserModel from "@/model/user.model.js";
import myDbConnection from "@/lib/myDbConnection";
import bcrypt from "bcryptjs";
export async function POST(req) {
  const { email, password } = await req.json();
  try {
    await myDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, password: hashedPassword });
    return Response.json({ newUser });
  } catch (error) {
    console.log("error in created user: ", error);
    return Response.json(
      {
        success: false,
        message: error.errorResponse.errmsg || "Error Registering user",
      },
      { status: 500 }
    );
  }
  return Response.json("ok");
}
