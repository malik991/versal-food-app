import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditableImage({ userImage }) {
  async function handleImageFile(ev) {
    const getFiles = ev.target.files;
    if (getFiles?.length === 1) {
      const data = new FormData();
      data.set("file", getFiles[0]);
      try {
        const savingPromise = new Promise(async (resolve, reject) => {
          const response = await axios.post("/api/uploadAvatar", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success === true) {
            resolve();
          } else {
            reject();
          }
        });
        toast.promise(
          savingPromise,
          {
            loading: "Image upLoading ...",
            success: `Uploaded!, please refresh`,
            error: `Error, please try Again`,
          },
          {
            style: {
              minWidth: "250px",
            },
            success: {
              duration: 5000,
              icon: "🔥",
            },
          }
        );
      } catch (error) {
        console.log("error in uploading avatar: ", error);
      }
    }
  }

  return (
    <>
      {userImage && (
        <Image
          className="rounded-full w-full h-full mb-2"
          src={userImage}
          alt="avatar"
          width={250}
          height={250}
        />
      )}
      {!userImage && (
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
          {userImage ? "Update" : "Upload"}
        </span>
      </label>
    </>
  );
}
