import { useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProp from "@/components/layout/MenuItemPriceProp";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [extraIngredients, setExtraIngredients] = useState(
    menuItem?.extraIngredients || []
  );

  return (
    <div
      className="grid items-start gap-2"
      style={{ gridTemplateColumns: ".3fr .7fr" }}
    >
      <div className="p-2 rounded-lg relative max-w-[120px]">
        <EditableImage link={image} insertIntoDb={false} setLink={setImage} />
      </div>
      <form
        onSubmit={(ev) =>
          onSubmit(ev, {
            name,
            description,
            basePrice,
            image,
            sizes,
            extraIngredients,
          })
        }
      >
        <div className="flex gap-3 items-start">
          <div className="grow">
            <label>Item name</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="new item name"
            />
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder="Description"
            />
            <label>Base price</label>
            <input
              type="text"
              value={basePrice}
              onChange={(ev) => setBasePrice(ev.target.value)}
              placeholder="Base price"
            />
            <MenuItemPriceProp
              heading={"Sizes"}
              btnLabel={"Add Item Sizes"}
              sizes={sizes}
              setSizes={setSizes}
            />
            <MenuItemPriceProp
              heading={"Extra Ingredients"}
              btnLabel={"Add Ingredients Prices"}
              sizes={extraIngredients}
              setSizes={setExtraIngredients}
            />
            <button type="submit">{menuItem ? "Update" : "Add"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
