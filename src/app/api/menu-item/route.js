import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MenuModel from "@/model/menuItems.model";
import { DeleteCloudinaryImage } from "@/lib/uploadCloudinary";
import { isAdmin } from "../auth/[...nextauth]/checkAdmin";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (await isAdmin()) {
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
    } else {
      return Response.json({
        suceess: false,
        message: "you are not authorized",
      });
    }
  } catch (error) {
    console.log("error in menu item api: ", error);
    throw error;
  }
}

export async function GET() {
  await myDbConnection();
  try {
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

    // return Response.json({ suceess: false, message: "you are not authorized" });
  } catch (error) {
    console.log("Error while fetching menue items: ", error);
    throw error;
  }
}

export async function PUT(req) {
  try {
    await myDbConnection();
    const { _id, data } = await req.json();
    const session = await getServerSession(authOptions);
    if (await isAdmin()) {
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
    }

    return Response.json({
      suceess: false,
      message: "you are not authorized",
    });
  } catch (error) {
    console.log("error in upadate menu item api: ", error);
    throw error;
  }
}

export async function DELETE(req) {
  //get qery from url
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  try {
    await myDbConnection();
    if (await isAdmin()) {
      if (!_id) {
        return Response.json({
          success: false,
          message: "Deleted item failed",
          data: {},
        });
      }

      const imageExist = await MenuModel.findById(_id);

      const result = await MenuModel.findOneAndDelete({ _id });
      if (!result) {
        return Response.json({
          success: false,
          message: "Item ID Not found for deleted",
          data: {},
        });
      }
      if (imageExist?.public_id) {
        console.log("yes present: ", imageExist?.public_id);
        const deleteImageResponse = await DeleteCloudinaryImage([
          imageExist.public_id,
        ]);
        if (!deleteImageResponse) {
          return NextResponse.json(
            {
              success: false,
              data: {},
              message: "cloudinary delete image failed",
            },
            { status: 400 }
          );
        }
      }

      return Response.json({
        success: true,
        message: "Deleted item successfully",
        data: { result },
      });
    } else {
      return Response.json({
        suceess: false,
        message: "you are not authorized",
      });
    }
  } catch (error) {
    console.log("error while delteing menu item APi: ", error);
    throw error;
  }
}
