export default function MenuItemTile({ tileProps, onClickToHandle }) {
  const { name, basePrice, description, image } = tileProps;
  return (
    <div
      className="bg-gray-200 rounded-lg p-3 text-center
     hover:bg-white transition-all hover:shadow-md hover:shadow-black/30"
    >
      <div className="text-center">
        <img
          src={image ? image : "/pizza.png"}
          alt="pizza"
          className="max-h-auto max-h-24 block mx-auto"
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
      <button
        type="button"
        onClick={onClickToHandle}
        className="bg-primary mt-2 rounded-full px-8 py-2 hover:bg-gray-300"
      >
        add to Cart {basePrice ? `$${basePrice}` : "$0"}
      </button>
    </div>
  );
}
