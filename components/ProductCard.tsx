import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import NutriScoreBadge from "./NutriScoreBadge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const name = product.product_name || "Unknown Product";
  const brand = product.brands?.split(",")[0]?.trim();
  const imgSrc =
    product.image_front_small_url || product.image_url || null;

  return (
    <article className="product-card">
      <Link
        href={`/product/${product.code}`}
        aria-label={`View details for ${name}`}
      >
        <div className="product-card__img-wrap">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={`${name} product image`}
              fill
              sizes="(max-width: 640px) 160px, 220px"
              style={{ objectFit: "contain", padding: "8px" }}
              unoptimized
            />
          ) : (
            <div className="product-card__img-placeholder" aria-hidden="true">
              🛒
            </div>
          )}
        </div>
      </Link>

      <div className="product-card__body">
        {brand && <p className="product-card__brand">{brand}</p>}

        <Link href={`/product/${product.code}`}>
          <h2 className="product-card__name" title={name}>
            {name}
          </h2>
        </Link>

        <div className="product-card__meta">
          <NutriScoreBadge grade={product.nutriscore_grade} />
          {product.nova_group && (
            <span
              className="nova-badge"
              title={`NOVA Group ${product.nova_group} — processing level`}
            >
              NOVA {product.nova_group}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
