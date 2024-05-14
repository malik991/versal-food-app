import Image from "next/image";
import { Trash } from "@/components/icons/Right";
import { cartProductPrice } from "../../app/context/authProvide";
export default function CartProducts({ product, needToRemove, index }) {
  return (
    <div className="flex gap-4 mb-2 border-b py-2 items-center">
      <div className="w-24">
        <Image src={product.image} alt="" width={240} height={240} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>
        {product.size && (
          <div className="text-sm text-gray-700">
            <span>size: {product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map((extra) => (
              <div key={extra._id}>
                <span className="text-gray-500">
                  {extra.name}: ${extra.price},
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="font-semibold text-lg mr-2">
        ${cartProductPrice(product)}
      </div>
      {!!needToRemove && (
        <div>
          <button
            type="button"
            onClick={() => needToRemove(index)}
            className="p-2"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
