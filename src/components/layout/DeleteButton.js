"use client";
import { useState } from "react";
import { Trash } from "../icons/Right";
export default function DeleteButton({ btnLabel, onDelete }) {
  const [onConfirm, setConfirm] = useState(false);
  if (onConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center ">
        <div className="bg-white rounded-lg p-4">
          <div>
            <span className="text-red-400 font-semibold text-sm">
              Are you sure, you want to Delete?
            </span>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => setConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                setConfirm(false);
              }}
              className="bg-primary text-white"
            >
              Yes
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={() => setConfirm(true)}>
        <Trash />
        {btnLabel}
      </button>
    </div>
  );
}
