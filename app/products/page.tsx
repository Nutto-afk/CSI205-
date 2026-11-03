"use client";

import { useContext } from "react";
import { globalDatacontext } from "../layout";
import { Product } from "@/data/products";
import Image from "next/image";
import { buttonStyles } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";

export default function ProductsPage() {
  const { products, setProducts, setCarts } = useContext(globalDatacontext);

  const handleAddToCart = (product: Product) => {
    setCarts((prev: Product[]) => [...(prev || []), product]);
    setProducts((prev: Product[]) =>
      prev.filter((p: Product) => p.id !== product.id)
    );
  };

  return (
    <div className="my-6 bg-[#eef8fa] border border-[#d2eff2] rounded-2xl max-w-4xl mx-auto p-4 shadow-sm">
      <div className="max-h-[460px] overflow-y-auto pr-1">
        {!products || products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3 text-neutral-500">
            <Spinner size="lg" />
            <span className="text-sm font-medium">Loading products...</span>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {products.map((product: Product) => (
              <div
                key={product.id}
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

                {/* Add to Carts Button */}
                <div className="p-1.5 flex justify-center bg-white">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={
                      buttonStyles({
                        variant: "success",
                        appearance: "outline",
                        size: "sm",
                      }) + " w-full !py-1 !text-xs cursor-pointer"
                    }
                  >
                    Add to Carts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
