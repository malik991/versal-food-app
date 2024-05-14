import myDbConnection from "@/lib/myDbConnection";
import { Category } from "@/model/categories.model";
import { isAdmin } from "../auth/[...nextauth]/checkAdmin";

export async function POST(req) {
  const { name } = await req.json();
  if (!name) {
    return Response.json({
      success: false,
      message: "provide category name",
      data: {},
    });
  }
  try {
    await myDbConnection();
    if (await isAdmin()) {
      const result = await Category.create({ name });
      if (result) {
        return Response.json({
          success: true,
          message: "category added successfuly",
          data: result,
        });
      }
    } else {
      return Response.json({
        suceess: false,
        message: "you are not authorized",
      });
    }
  } catch (error) {
    console.log("error in creating category api: ", error);
    return Response.json({
      success: false,
      message: "category added Failed",
      data: error.message,
    });
  }
}

export async function GET() {
  return Response.json(await Category.find());
}

export async function PUT(req) {
  const data = await req.json();
  if (!data) {
    return Response.json({ success: false, error: "No data provided" });
  }
  // Validate incoming data (e.g., check if _id and name are present)
  if (!data._id || !data.name) {
    return Response.json({ success: false, error: "Invalid data format" });
  }
  try {
    if (await isAdmin()) {
      const result = await Category.findByIdAndUpdate(
        { _id: data?._id },
        {
          $set: {
            name: data?.name,
          },
        },
        {
          new: true,
        }
      );
      if (!result) {
        return Response.json({ success: false, error: "Category not found" });
      }
      return Response.json({ success: true, data: result });
    } else {
      return Response.json({
        suceess: false,
        message: "you are not authorized",
      });
    }
  } catch (error) {
    console.log("error in update category name api: ", error.message);
    return Response.json({
      success: false,
      error: "Internal server error in category",
    });
  }
}
