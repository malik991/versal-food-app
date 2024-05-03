import { UploadImage, DeleteCloudinaryImage } from "@/lib/uploadCloudinary";
import { NextRequest, NextResponse } from "next/server";
import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";

export const POST = async (req: NextRequest) => {
  try {
    await myDbConnection();
    const data = await req.formData();
    const _id = data?.get("_id");

    const image = data.get("file") as unknown as File;

    const session = await getServerSession(authOptions);
    const email = session.user?.email;
    let imageExist: any;
    let response: any;
    if (_id) {
      imageExist = await UserModel.findOne({ _id });
    } else {
      imageExist = await UserModel.findOne({ email });
    }

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
      }
    }
    const responseData: any = await UploadImage(image, "nextjs-pizza");
    if (!responseData) {
      return NextResponse.json(
        { success: false, data: {}, message: "cloudinary upload failed" },
        { status: 400 }
      );
    }
    if (_id) {
      response = await UserModel.findOneAndUpdate(
        { _id },
        {
          image: responseData?.secure_url || "",
          public_id: responseData?.public_id || "",
        },
        { new: true }
      );
    } else {
      response = await UserModel.findOneAndUpdate(
        { email },
        {
          image: responseData?.secure_url || "",
          public_id: responseData?.public_id || "",
        },
        { new: true }
      );
    }

    if (response) {
      return NextResponse.json(
        { success: true, data: {}, message: "uploaded success" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, data: {}, message: "Avatar not updated in Db" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("error in upload avatar api: ", error);
    return NextResponse.json(
      {
        success: false,
        data: {},
        message: error?.message || "server error in upload avatar",
      },
      { status: 500 }
    );
  }
};
