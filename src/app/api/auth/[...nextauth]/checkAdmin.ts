import { getServerSession } from "next-auth";
import { authOptions } from "./options";
import UserModel from "@/model/user.model";

// Utility function to check if user is admin
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserModel.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.IsAdmin;
}
