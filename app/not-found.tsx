import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div style={{ padding: "6rem 0", textAlign: "center" }}>
      <div className="container">
        <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</p>
        <h1 className="hero__title" style={{ marginBottom: "0.75rem" }}>
          <span className="gradient-text">404</span> — Not Found
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          We couldn&rsquo;t find that product or page. It may have been removed or
          the barcode is incorrect.
        </p>
        <Link
          href="/"
          className="search-btn"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          ← Back to Discovery Hub
        </Link>
      </div>
    </div>
  );
}
