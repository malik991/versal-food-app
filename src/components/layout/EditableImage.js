import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditableImage({
  link,
  insertIntoDb,
  setLink,
  userIDforAvatar,
}) {
  async function handleImageFile(ev) {
    const getFiles = ev.target.files;
    if (getFiles?.length === 1) {
      const data = new FormData();
      data.set("file", getFiles[0]);
      if (userIDforAvatar) {
        data.set("_id", userIDforAvatar);
      }
      let response;
      if (insertIntoDb) {
        response = axios.post(`/api/uploadAvatar`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = axios.post("/api/image-upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.promise(
        response,
        {
          loading: "Image Up-Loading ...",
          success: (res) => {
            console.log("res: ", res);
            if (res.data.success === true) {
              if (!insertIntoDb) {
                setLink(res.data?.data?.image);
              }
              return "Uploaded!, please Refresh";
            } else {
              throw new Error("image not ");
            }
          },
          error: (err) => `Error, please try Again`,
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          success: {
            duration: 5000,
            icon: "🔥",
          },
        }
      );
    }
  }

  return (
    <>
      {link && (
        <Image
          className="rounded-full w-full h-full mb-2"
          src={link}
          alt="avatar"
          width={250}
          height={250}
        />
      )}
      {!link && (
        <div className="bg-gray-200 p-4 text-gray-500 mb-1 rounded-lg">
          no image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleImageFile} />
        <span
          className="block text-center p-2 border border-gray-300 
                rounded-lg cursor-pointer hover:bg-primary"
        >
          {link ? "Update" : "Upload"}
        </span>
      </label>
    </>
  );
}
