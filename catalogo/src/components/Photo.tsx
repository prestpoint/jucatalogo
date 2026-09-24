import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { ProductImage } from "../data";

export function Photo({
  image,
  className = "",
}: {
  image: ProductImage;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  if (failed)
    return (
      <div className={`photo photo-placeholder ${className}`}>
        <ShoppingBag />
        <span>Foto em breve</span>
      </div>
    );
  const c = image.crop;
  return (
    <div
      className={`photo ${c ? "photo-crop" : ""} ${className}`}
      style={c ? { aspectRatio: `${c.width}/${c.height}` } : undefined}
    >
      <img
        loading="lazy"
        src={image.src}
        alt={image.alt}
        onError={() => setFailed(true)}
        style={
          c
            ? {
                width: `${(c.sourceWidth / c.width) * 100}%`,
                maxWidth: "none",
                left: `${(-c.x / c.width) * 100}%`,
                top: `${(-c.y / c.height) * 100}%`,
              }
            : undefined
        }
      />
    </div>
  );
}
