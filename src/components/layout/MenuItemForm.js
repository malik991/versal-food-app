import { useState, useEffect } from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProp from "@/components/layout/MenuItemPriceProp";
import axios from "axios";
import toast from "react-hot-toast";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || "");
  const [allCategories, setAllCategories] = useState([]);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [menuId] = useState(menuItem?._id || "");
  const [public_id, setCloudinaryId] = useState(menuItem?.public_id || "");
  const [extraIngredients, setExtraIngredients] = useState(
    menuItem?.extraIngredients || []
  );

  useEffect(() => {
    axios
      .get("/api/category")
      .then((response) => {
        if (response) {
          setAllCategories(response?.data);
        }
      })
      .catch((err) => {
        console.log("error while fetching categories in menuFOrm: ", err);
        toast.error("Error while fetching categories");
      });
  }, []);

  return (
    <div
      className="block sm:grid sm:grid-cols-2 sm:items-start gap-2"
      style={{ gridTemplateColumns: ".3fr .7fr" }}
    >
      <div>
        {menuId ? (
          <EditableImage
            link={image}
            insertIntoDb={false}
            setLink={setImage}
            userIDforAvatar={menuId}
          />
        ) : (
          <EditableImage
            link={image}
            insertIntoDb={false}
            setLink={setImage}
            setPublicId={setCloudinaryId}
          />
        )}
      </div>
      <div>
        <form
          onSubmit={(ev) =>
            onSubmit(ev, {
              name,
              description,
              basePrice,
              image,
              sizes,
              extraIngredients,
              category,
              public_id,
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
              <label>Category</label>
              <select
                value={category}
                onChange={(ev) => {
                  setCategory(ev.target.value);
                  setIsCategorySelected(true);
                }}
              >
                {!isCategorySelected && (
                  <option value="" disabled>
                    Please select a category
                  </option>
                )}
                {allCategories.length > 0 &&
                  allCategories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
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
    </div>
  );
}
