import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MenuModel from "@/model/menuItems.model";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    const { data } = await req.json();
    await myDbConnection();
    if (!data?.name || !data?.description || !data?.basePrice) {
      return Response.json({
        success: false,
        data: {},
        message: "all fields mendatory",
      });
    }
    if (session?.user?.email) {
      console.log(data);
      const response = await MenuModel.create(data);
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

export async function GET() {
  try {
    await myDbConnection();
    const result = await MenuModel.find();
    if (!result) {
      return Response.json(
        { success: false, data: {}, message: "Data not fetched" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, data: result, message: "data feched succesfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching menue items: ", error);
    throw error;
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    const { _id, data } = await req.json();
    await myDbConnection();
    if (session?.user?.email) {
      const response = await MenuModel.findByIdAndUpdate(_id, data);
      if (response) {
        return Response.json({
          success: true,
          data: { response },
          message: "item updated successfully",
        });
      } else {
        return Response.json({
          success: false,
          data: {},
          message: "menu item not updated",
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
    console.log("error in upadate menu item api: ", error);
    throw error;
  }
}
