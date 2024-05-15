import myDbConnection from "@/lib/myDbConnection";
import { Category } from "@/model/categories.model";
import { isAdmin } from "../../auth/[...nextauth]/checkAdmin";

export async function DELETE(req, { params }) {
  const itemId = params?.idToDelete;
  try {
    await myDbConnection();
    if (await isAdmin()) {
      const res = await Category.findOneAndDelete({ _id: itemId });
      if (!res) {
        return Response.json(
          { success: false, message: "item not found", data: {} },
          { status: 404 }
        );
      }
      return Response.json(
        { success: true, message: "item deleted", data: { res } },
        { status: 200 }
      );
    }
    return Response.json({ suceess: false, message: "you are not authorized" });
  } catch (error) {
    console.log("error in delte category item api: ", error);
    throw error;
  }
}
