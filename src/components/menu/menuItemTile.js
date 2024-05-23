import AddToCartButton from "@/components/menu/AddToCartButton";
import Image from "next/image";

export default function MenuItemTile({ tileProps, onClickToHandle }) {
  const { name, basePrice, description, image, sizes, extraIngredients } =
    tileProps;
  const hasExtraOrSize = sizes?.length > 0 || extraIngredients?.length > 0;
  return (
    <div
      className="bg-gray-200 rounded-lg p-3 text-center
     hover:bg-white transition-all hover:shadow-md hover:shadow-black/30"
    >
      <div className="text-center">
        <Image
          src={image ? image : "/pizza.png"}
          alt="pizza"
          width={200}
          height={200}
          className="block mx-auto"
          style={{ width: "auto", height: "auto" }}
          priority={true}
        />
      </div>
      <h4 className="font-semibold text-xl my-2">
        {name ? name : "Pepproni Pizza"}
      </h4>
      <p className="text-gray-500 text-sm line-clamp-3">
        {description
          ? description
          : `It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout`}
      </p>
      <AddToCartButton
        basePrice={basePrice}
        onClick={onClickToHandle}
        hasExtraOrSize={hasExtraOrSize}
        image={image}
      />
    </div>
  );
}
