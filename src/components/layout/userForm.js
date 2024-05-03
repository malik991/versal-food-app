"use client";
import { useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import { useProfile } from "../MyHooks/UseProfile";

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
  return (
    <div
      className="grid items-start gap-3"
      style={{ gridTemplateColumns: ".3fr .7fr" }}
    >
      <div>
        <EditableImage
          link={userImage}
          insertIntoDb={true}
          userIDforAvatar={userIdIfExist}
        />
      </div>

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
        <label>Mobile</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="+123456"
        />
        <label>Street Address</label>
        <input
          type="text"
          value={Street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Street address"
        />
        <div className="flex gap-2">
          <div>
            <label>Postal Code</label>
            <input
              type="text"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              placeholder="Postal Code"
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
        </div>
        <label>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
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
  );
}
