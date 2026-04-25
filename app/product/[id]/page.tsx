import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/openfoodfacts";
import NutriScoreBadge from "@/components/NutriScoreBadge";
import NutritionTable from "@/components/NutritionTable";
import AddToCartDetail from "@/components/AddToCartDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    const name = product.product_name ?? "Unknown Product";
    const brand = product.brands?.split(",")[0]?.trim();
    const title = brand ? `${name} by ${brand}` : name;
    const description = `Nutritional information, ingredients, and Nutri-Score for ${name}${brand ? ` by ${brand}` : ""}. Powered by Open Food Facts.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | FreshNexus`,
        description,
        images: product.image_front_url ? [{ url: product.image_front_url }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | FreshNexus`,
        description,
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductIntelligence({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  const name = product.product_name ?? "Unknown Product";
  const brand = product.brands?.split(",")[0]?.trim();
  const imgSrc = product.image_front_url ?? product.image_url ?? null;

  const allergensList = product.allergens_tags
    ?.map((a) => a.replace(/^en:/, "").replace(/-/g, " "))
    .filter(Boolean) ?? [];

  const labelsList = product.labels_tags
    ?.map((l) => l.replace(/^en:/, "").replace(/-/g, " "))
    .filter(Boolean) ?? [];

  const categoryName =
    product.categories?.split(",")[0]?.trim() ??
    product.categories_tags?.[0]?.replace(/^en:/, "").replace(/-/g, " ");

  // Deterministic fake price for realistic cart testing
  const rawNum = parseInt((product.code || "123").slice(-4)) || 499;
  const price = (Math.abs(rawNum) % 15) + (Math.abs(rawNum) % 99) / 100 + 1.99;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Back link */}
        <Link href="/" className="detail-back" aria-label="Back to Discovery Hub">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Discovery Hub
        </Link>

        <article className="detail-grid" aria-label={`Product details for ${name}`}>
          {/* Image */}
          <div>
            <div className="detail-img-wrap">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={`Product image for ${name}`}
                  fill
                  style={{ objectFit: "contain", padding: "16px" }}
                  priority
                  unoptimized
                />
              ) : (
                <div className="detail-img-placeholder" aria-hidden="true">
                  🛒
                </div>
              )}
            </div>

            {/* Nutri Score bar */}
            <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "center" }}>
              <NutriScoreBadge grade={product.nutriscore_grade} size="lg" />
            </div>
          </div>

          {/* Details */}
          <div className="detail-info">
            <div>
              <div className="detail-eyebrow">
                {brand && <span className="detail-brand">{brand}</span>}
                {categoryName && (
                  <span className="badge badge--muted">{categoryName}</span>
                )}
              </div>
              <h1 className="detail-title">{name}</h1>
              {product.quantity && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                  {product.quantity}
                </p>
              )}
            </div>

            {/* Badges */}
            {(product.nutriscore_grade || product.ecoscore_grade || product.nova_group || labelsList.length > 0) && (
              <div className="detail-badges" aria-label="Product scores and labels">
                {product.nutriscore_grade && (
                  <span className="badge badge--accent">
                    Nutri-Score {product.nutriscore_grade.toUpperCase()}
                  </span>
                )}
                {product.ecoscore_grade && (
                  <span className="badge badge--emerald">
                    Eco-Score {product.ecoscore_grade.toUpperCase()}
                  </span>
                )}
                {product.nova_group && (
                  <span className="badge badge--indigo">
                    NOVA {product.nova_group}
                  </span>
                )}
                {labelsList.slice(0, 3).map((label) => (
                  <span key={label} className="badge badge--muted">{label}</span>
                ))}
              </div>
            )}

            {/* Add to Cart Client Component Component */}
            <AddToCartDetail product={product} price={price} />

            {/* Nutrition */}
            <section className="info-section" aria-labelledby="nutrition-heading">
              <h2 className="info-section__title" id="nutrition-heading">
                Nutritional Values (per 100g)
              </h2>
              <NutritionTable nutriments={product.nutriments} />
            </section>

            {/* Ingredients */}
            {product.ingredients_text && (
              <section className="info-section" aria-labelledby="ingredients-heading">
                <h2 className="info-section__title" id="ingredients-heading">
                  Ingredients
                </h2>
                <p className="info-section__text">{product.ingredients_text}</p>
              </section>
            )}

            {/* Allergens */}
            {allergensList.length > 0 && (
              <section className="info-section" aria-labelledby="allergens-heading">
                <h2 className="info-section__title" id="allergens-heading">
                  Allergens
                </h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {allergensList.map((a) => (
                    <span key={a} className="badge badge--warn">{a}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Origin info */}
            {(product.origins || product.countries || product.manufacturing_places) && (
              <section className="info-section" aria-labelledby="origin-heading">
                <h2 className="info-section__title" id="origin-heading">
                  Origin & Distribution
                </h2>
                <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.35rem 1.5rem" }}>
                  {product.origins && (
                    <>
                      <dt style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Origin</dt>
                      <dd style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{product.origins}</dd>
                    </>
                  )}
                  {product.countries && (
                    <>
                      <dt style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Sold in</dt>
                      <dd style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{product.countries}</dd>
                    </>
                  )}
                  {product.manufacturing_places && (
                    <>
                      <dt style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Made in</dt>
                      <dd style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{product.manufacturing_places}</dd>
                    </>
                  )}
                </dl>
              </section>
            )}

            {/* Barcode */}
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Barcode: <code style={{ fontFamily: "monospace" }}>{product.code}</code> &mdash;{" "}
              <a
                href={`https://world.openfoodfacts.org/product/${product.code}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", opacity: 0.8 }}
              >
                View on Open Food Facts ↗
              </a>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
