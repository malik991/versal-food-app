import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import MenuModel from "@/model/menuItems.model";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { name, description, basePrice } = await req.json();
    await myDbConnection();

    if (!name || !description || !basePrice) {
      return Response.json({
        success: false,
        data: {},
        message: "all fields mendatory",
      });
    }
    if (session?.user?.email) {
      const response = await MenuModel.create({ name, description, basePrice });
      if (response) {
        return Response.json({
          success: true,
          data: { response },
          message: "item created successfully",
        });
      } else {
        return Response.json({
          success: false,
          data: {},
          message: "menu item not saved",
        });
      }
    } else {
      return Response.json(
        {
          success: false,
          data: {},
          message: "user not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("error in menu item api: ", error);
    throw error;
  }
}
