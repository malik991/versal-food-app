"use client";

import { useState } from "react";
import { Trash, AddIcon, ChevronUp, ChevronDown } from "../icons/Right";

export default function MenuItemPriceProp({
  heading,
  btnLabel,
  sizes,
  setSizes,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function addSizes() {
    setSizes((prvSizes) => {
      return [...prvSizes, { name: "", price: 0 }];
    });
  }

  function handlePriceAndNameValue(ev, getIndex, propName) {
    const newValue = ev.target.value;
    setSizes((prevProps) => {
      const newSizeValue = [...prevProps];
      newSizeValue[getIndex][propName] = newValue;
      return newSizeValue;
    });
  }

  function handleDeleteRow(indexToRemove) {
    setSizes((prev) => prev.filter((v, index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 rounded-md p-2 mb-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex p-1 border-0 justify-start"
        type="button"
      >
        {isOpen && <ChevronUp />}
        {!isOpen && <ChevronDown />}
        <span>{heading}</span>
        <span>({sizes?.length})</span>
      </button>
      <div className={isOpen ? "block" : "hidden"}>
        {sizes?.length > 0 &&
          sizes.map((size, index) => (
            <div key={index} className="flex gap-1 items-end">
              <div>
                <label>
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  placeholder="size name"
                  value={size.name}
                  onChange={(ev) => handlePriceAndNameValue(ev, index, "name")}
                />
              </div>
              <div>
                <label>
                  <span>Price</span>
                </label>
                <input
                  type="text"
                  placeholder="size price"
                  value={size.price}
                  onChange={(ev) => handlePriceAndNameValue(ev, index, "price")}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleDeleteRow(index)}
                  className="bg-white mb-2 p-2"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        <button type="button" onClick={addSizes} className="bg-white">
          <AddIcon clasName="w-5 h-5" />
          <span>{btnLabel}</span>
        </button>
      </div>
    </div>
  );
}
