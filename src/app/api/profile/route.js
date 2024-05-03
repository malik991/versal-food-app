import myDbConnection from "@/lib/myDbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
export async function PUT(req) {
  try {
    await myDbConnection();
    const { id, data } = await req.json();
    if (!data.name) {
      return Response.json({
        success: false,
        message: "name is mendatory",
        data: {},
      });
    }
    const session = await getServerSession(authOptions);
    const email = session.user?.email;
    let response;
    console.log("Id is: ", id);
    if (id) {
      response = await UserModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: data.name,
            mobile: data.mobile,
            Street: data.Street,
            postCode: data.postCode,
            city: data.city,
            country: data.country,
            IsAdmin: data.IsAdmin,
          },
        },
        { new: true }
      );
    } else {
      response = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            name: data.name,
            mobile: data.mobile,
            Street: data.Street,
            postCode: data.postCode,
            city: data.city,
            country: data.country,
            IsAdmin: data.IsAdmin,
          },
        },
        { new: true }
      );
    }

    if (response) {
      return Response.json({
        success: true,
        message: "record updated",
        data: {},
      });
    }
    return Response.json({
      success: false,
      message: "record not updated",
      data: {},
    });
  } catch (error) {
    console.log("error in api profile: ", error);
    return Response.json({
      success: false,
      message: error || "Error in profile api endpoint",
      data: {},
    });
  }
}

export async function GET(req) {
  await myDbConnection();
  const url = new URL(req.url);
  const _id = url.searchParams.get("id");
  if (_id) {
    return Response.json({
      success: true,
      data: await UserModel.findOne({ _id }).select("-password"),
    });
  } else {
    const session = await getServerSession(authOptions);
    // console.log(mobile);
    const email = session?.user?.email;
    if (!email) {
      return Response.json({});
    }
    return Response.json(await UserModel.findOne({ email }));
  }
}
