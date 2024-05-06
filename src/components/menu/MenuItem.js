import { CartContext } from "@/app/context/authProvide";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import MenuItemTile from "@/components/menu/menuItemTile";
import Image from "next/image";
export default function MenuItem(propProduct) {
  const { name, basePrice, description, image, sizes, extraIngredients } =
    propProduct;
  const [showPopup, setShowPopup] = useState(false);
  const [selectSize, setSelectedSize] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const { addToCart } = useContext(CartContext);
  function handleAddToCart() {
    const hasOptions = sizes?.length > 0 || extraIngredients?.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(propProduct, selectSize, selectedExtras);
    setShowPopup(false);
    toast.success("item add to cart");
  }
  function handleExtraIngrediens(e, extraThing) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraThing]);
    } else {
      setSelectedExtras((prev) => {
        return prev.filter((e) => e.name !== extraThing.name);
      });
    }
  }
  let selectedPrice = basePrice;
  if (selectSize) {
    selectedPrice += selectSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (let index = 0; index < selectedExtras.length; index++) {
      selectedPrice += selectedExtras[index].price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="bg-white p-4 rounded-md max-w-md my-8"
          >
            <div
              className="overflow-y-scroll p-2"
              style={{ maxHeight: "calc(100vh - 80px)" }}
            >
              <Image
                src={image}
                alt={name}
                width={300}
                height={200}
                className="mx-auto"
              />
              <h2 className="font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-600 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="mb-2 text-center text-gray-400 font-semibold">
                    pick your size
                  </h3>
                  {sizes.map((item) => (
                    <label
                      className="flex items-center gap-2 border rounded-lg mb-1 p-4"
                      key={item.name}
                    >
                      <input
                        onChange={() => setSelectedSize(item)}
                        checked={selectSize?.name === item.name}
                        type="radio"
                        name="item"
                      />{" "}
                      {item.name} ${basePrice + item.price}
                    </label>
                  ))}
                </div>
              )}

              {extraIngredients?.length > 0 && (
                <div className="py-2">
                  <h3 className="mb-2 text-center text-gray-400 font-semibold">
                    Any Extras?
                  </h3>
                  {/* {JSON.stringify(selectedExtras)} */}
                  {extraIngredients.map((extra) => (
                    <label
                      className="flex items-center gap-2 border rounded-lg mb-1 p-4"
                      key={extra.name}
                    >
                      <input
                        onClick={(ev) => handleExtraIngrediens(ev, extra)}
                        type="checkbox"
                        name={extra.name}
                      />{" "}
                      {extra.name} +$
                      {extra.price}
                    </label>
                  ))}
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="bg-primary my-2 sticky bottom-2"
                type="button"
              >
                <span className="text-white">
                  {" "}
                  Add to Cart ${selectedPrice}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile tileProps={propProduct} onClickToHandle={handleAddToCart} />
    </>
  );
}
