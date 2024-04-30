import { UploadImage, DeleteCloudinaryImage } from "@/lib/uploadCloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";

export const POST = async (req: NextRequest) => {
  try {
    const getFile = await req.formData();
    const getImage = getFile.get("file") as unknown as File;
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const responseData: any = await UploadImage(
        getImage,
        "food-ordering-app"
      );
      if (!responseData) {
        return NextResponse.json(
          { success: false, data: {}, message: "cloudinary upload failed" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          data: { image: responseData?.secure_url },
          message: "image uploaded",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, data: {}, message: "user not authenticated" },
      { status: 400 }
    );
  } catch (error) {
    console.log("error in upload avatar api: ", error);
    throw error;
  }
};
