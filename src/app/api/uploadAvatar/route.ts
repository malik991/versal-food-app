import { UploadImage } from "@/lib/uploadCloudinary";
import { NextRequest, NextResponse } from "next/server";
import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";

export const POST = async (req: NextRequest) => {
  try {
    await myDbConnection();
    const getFile = await req.formData();
    const image = getFile.get("file") as unknown as File;
    const responseData: any = await UploadImage(image, "nextjs-pizza");
    if (!responseData) {
      return NextResponse.json(
        { success: false, data: {}, message: "cloudinary upload failed" },
        { status: 400 }
      );
    }
    const session = await getServerSession(authOptions);
    const email = session.user?.email;
    const response = await UserModel.findOneAndUpdate(
      { email },
      {
        image: responseData?.secure_url || "",
        public_id: responseData?.public_id || "",
      },
      { new: true }
    );
    if (response) {
      return NextResponse.json(
        { success: true, data: response, message: "uploaded success" },
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
