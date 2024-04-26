import myDbConnection from "@/lib/myDbConnection";
import { Category } from "@/model/categories.model";

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
    const result = await Category.create({ name });
    if (result) {
      return Response.json({
        success: true,
        message: "category added successfuly",
        data: result,
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
