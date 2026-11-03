"use client";

import { useContext } from "react";
import { globalDatacontext } from "../layout";
import { Product } from "@/data/products";
import Image from "next/image";
import { buttonStyles } from "@/components/tailgrids/core/button";

export default function CartsPage() {
  const { carts, setCarts, setProducts } = useContext(globalDatacontext);

  const handleRemove = (productToRemove: Product, indexToRemove: number) => {
    setCarts((prev: Product[]) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setProducts((prev: Product[]) =>
      [...(prev || []), productToRemove].sort((a, b) => a.id - b.id)
    );
  };

  const totalPrice = carts
    ? carts.reduce((acc: number, item: Product) => acc + (item.price || 0), 0)
    : 0;

  return (
    <div className="my-6 bg-[#eef8fa] border border-[#d2eff2] rounded-2xl max-w-4xl mx-auto p-4 shadow-sm flex flex-col">
      <div className="max-h-[460px] overflow-y-auto pr-1">
        {carts && carts.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {carts.map((product: Product, index: number) => (
              <div
                key={`${product.id}-${index}`}
                className="bg-white border border-neutral-300 rounded-lg overflow-hidden flex flex-col shadow-xs"
              >
                {/* Image with Price & Title Overlay */}
                <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </span>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-1.5 py-1 line-clamp-2 leading-tight">
                    {product.title}
                  </div>
                </div>

                {/* Remove Button */}
                <div className="p-1.5 flex justify-center bg-white">
                  <button
                    type="button"
                    onClick={() => handleRemove(product, index)}
                    className={
                      buttonStyles({
                        variant: "danger",
                        appearance: "outline",
                        size: "sm",
                      }) + " w-full !py-1 !text-xs cursor-pointer"
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No items in cart
          </div>
        )}
      </div>

      {/* Summary Pills: Count & Total Price */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <span className="bg-amber-400 text-white font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm shadow-xs">
          Count: {carts?.length || 0} items
        </span>
        <span className="bg-red-500 text-white font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm shadow-xs">
          Price: ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
