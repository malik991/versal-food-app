import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "./options";
//import UserModel from "@/model/user.model";

const handler = NextAuth(authOptions);

// export async function isAdmin() {
//   const session = await getServerSession(authOptions);
//   const userEmail = session?.user?.email;
//   if (!userEmail) {
//     return false;
//   }
//   const userInfo = await UserModel.findOne({ email: userEmail });
//   if (!userInfo) {
//     return false;
//   }
//   return userInfo.IsAdmin;
// }

export { handler as GET, handler as POST };
