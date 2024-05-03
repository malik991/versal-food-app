import { UploadImage, DeleteCloudinaryImage } from "@/lib/uploadCloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MenuModel from "@/model/menuItems.model";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    const getImage = data.get("file") as unknown as File;
    const _id = data.get("_id");
    const session = await getServerSession(authOptions);
    let imageExist: any;
    let responseData: any;
    if (_id) {
      imageExist = await MenuModel.findOne({ _id });
      if (imageExist?.public_id) {
        console.log("yes present: ", imageExist?.public_id);
        const deleteImageResponse: any = await DeleteCloudinaryImage([
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
        } else {
          responseData = await UploadImage(getImage, "food-ordering-app");
          if (!responseData) {
            return NextResponse.json(
              { success: false, data: {}, message: "cloudinary upload failed" },
              { status: 400 }
            );
          }
          return NextResponse.json(
            {
              success: true,
              data: {
                image: responseData?.secure_url,
                public_id: responseData?.public_id,
              },
              message: "image uploaded",
            },
            { status: 200 }
          );
        }
      }
    } else {
      if (session?.user?.email) {
        responseData = await UploadImage(getImage, "food-ordering-app");
        if (!responseData) {
          return NextResponse.json(
            { success: false, data: {}, message: "cloudinary upload failed" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          {
            success: true,
            data: {
              image: responseData?.secure_url,
              public_id: responseData?.public_id,
            },
            message: "image uploaded",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, data: {}, message: "user not authenticated" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.log("error in upload avatar api: ", error);
    throw error;
  }
};
