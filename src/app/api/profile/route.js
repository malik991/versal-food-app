import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
export async function PUT(req) {
  try {
    await myDbConnection();
    const { name } = await req.json();
    console.log("name is: ", name);
    const session = await getServerSession(authOptions);
    console.log(session);
    return Response.json(true);
  } catch (error) {
    console.log("error in api profile: ", error);
  }
}
