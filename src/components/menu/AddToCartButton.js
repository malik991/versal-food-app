import FlyingButton from "react-flying-item";
export default function AddToCartButton({
  hasExtraOrSize,
  onClick,
  basePrice,
  image,
}) {
  if (!hasExtraOrSize) {
    return (
      <div className="flying-button mt-2" onClick={onClick}>
        <FlyingButton src={image} targetTop="5%" targetLeft="95%">
          <span> add to Cart ${basePrice}</span>
        </FlyingButton>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary mt-2 text-white rounded-full px-8 py-2 hover:bg-gray-300 hover:text-black"
    >
      <span>add to Cart (From ${basePrice})</span>
    </button>
  );
}
