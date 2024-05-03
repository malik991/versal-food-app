import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MenuModel from "@/model/menuItems.model";
import { DeleteCloudinaryImage } from "@/lib/uploadCloudinary";

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

export async function DELETE(req) {
  //get qery from url
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  try {
    if (!_id) {
      return Response.json({
        success: false,
        message: "Deleted item failed",
        data: {},
      });
    }
    await myDbConnection();
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
  } catch (error) {
    console.log("error while delteing menu item APi: ", error);
    throw error;
  }
}
