"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Discovery Hub" },
  { href: "/insights", label: "Market Insights" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar__inner" aria-label="Main navigation">
          <Link href="/" className="navbar__logo" aria-label="FreshNexus Home">
            🥦 FreshNexus<span className="dot">.</span>
          </Link>

          <ul className="navbar__links" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`navbar__link${isActive ? " navbar__link--active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
