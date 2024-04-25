import UserModel from "@/model/user.model.js";
import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req) {
  const data = await req.formData();
  console.log(data.get("file"));
  return Response.json(true);
  //   const session = await getServerSession(authOptions);
  //   const email = session.user?.email;
  //   const response = await UserModel.findOneAndUpdate(
  //     { email },
  //     { Image: data.Image },
  //     { new: true }
  //   );
}
