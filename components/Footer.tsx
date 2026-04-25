export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          <span>
            🥦 <strong>FreshNexus</strong> &mdash; Grocery Intelligence Platform
          </span>
          <span>
            Data by{" "}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", opacity: 0.85 }}
            >
              Open Food Facts
            </a>{" "}
            &amp;{" "}
            <a
              href="https://www.frankfurter.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-2)", opacity: 0.85 }}
            >
              Frankfurter
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
