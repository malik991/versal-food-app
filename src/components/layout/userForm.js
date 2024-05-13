"use client";
import { useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import { useProfile } from "../MyHooks/UseProfile";
import AddressInput from "@/components/layout/addressInput";

export default function UserForm({ user, onSave, userIdIfExist }) {
  const [userName, setUsername] = useState(user?.name || "");
  const [userImage, setUserImage] = useState(user?.image || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [Street, setStreet] = useState(user?.Street || "");
  const [postCode, setPostCode] = useState(user?.postCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [IsAdmin, setAdmin] = useState(user?.IsAdmin || false);
  const { data: loggedInUser } = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === "mobile") setMobile(value);
    if (propName === "Street") setStreet(value);
    if (propName === "postCode") setPostCode(value);
    if (propName === "city") setCity(value);
    if (propName === "country") setCountry(value);
  }
  return (
    <div
      className="block sm:grid sm:grid-cols-2 items-start gap-3"
      style={{ gridTemplateColumns: ".3fr .7fr" }}
    >
      <div>
        <EditableImage
          link={userImage}
          insertIntoDb={true}
          userIDforAvatar={userIdIfExist}
        />
      </div>
      <div>
        <form
          className="grow"
          onSubmit={(ev) =>
            onSave(ev, {
              name: userName,
              userImage,
              mobile,
              Street,
              postCode,
              city,
              country,
              IsAdmin,
            })
          }
        >
          <label>Full Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="first and last name"
          />
          <label>Email</label>
          <input
            type="email"
            disabled={true}
            value={user?.email}
            placeholder="first and last name"
          />
          <AddressInput
            addressProps={{ mobile, Street, postCode, city, country }}
            setAddressProp={handleAddressChange}
          />
          {loggedInUser.IsAdmin && (
            <div>
              {/* {JSON.stringify(IsAdmin)} */}
              <label
                htmlFor="adminCB"
                className="p-1 inline-flex items-center gap-2 my-3"
              >
                <input
                  id="adminCB"
                  type="checkbox"
                  value={"1"}
                  checked={IsAdmin}
                  onClick={(e) => setAdmin(e.target.checked)}
                />
                <span>Admin</span>
              </label>
            </div>
          )}

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
