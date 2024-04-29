import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditableImage({ link, findRoute, setLink }) {
  async function handleImageFile(ev) {
    const getFiles = ev.target.files;
    if (getFiles?.length === 1) {
      const data = new FormData();
      data.set("file", getFiles[0]);
      // try {
      // const savingPromise = new Promise(async (resolve, reject) => {
      let response;
      if (findRoute === "profile") {
        response = axios.post("/api/uploadAvatar", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (findRoute === "item") {
        response = axios.post("/api/menu-item-pic", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      // if (response?.data?.success === true) {
      //   setLink(response.data.imageURL);
      //   //toast.success("Image uploaded successfully!");
      // } else {
      //   throw new Error("Something went wrong");
      // }

      toast.promise(
        response,
        {
          loading: "Image Up-Loading ...",
          success: (res) => {
            console.log("res: ", res);
            if (res.data.success === true) {
              setLink(res.data.imageURL);
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
      // } catch (error) {
      //   console.log("error in uploading avatar: ", error);
      //   toast.error("Error uploading image, please try again");
      // }
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
