// components/site-footer.tsx
import Link from "next/link";

const footerSections = [
  {
    title: "Collection",
    links: [
      { href: "/products", label: "Current Collection" },
      { href: "/products?category=shade-sets", label: "Shade Sets" },
      { href: "/products?category=single-shades", label: "Single Shades" },
      { href: "/products?category=accessories", label: "Accessories" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { href: "/materials", label: "Materials" },
      { href: "/production", label: "Production" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "/shipping", label: "Fulfilment" },
      { href: "/safety", label: "Safety" },
      { href: "/returns", label: "Returns" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-limestone/35 bg-deep-brown text-shell">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
              aria-label="ArcVane Studio home"
            >
              <span className="h-2 w-2 rounded-full bg-warm-amber" />
              <span className="text-lg font-semibold tracking-tight text-off-white">
                ArcVane Studio
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-shell/75">
              A Western Australian lighting atelier for translucent PLA diffusion, modular E27 shade
              systems, and small-run coastal objects.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-horizon-blue/75">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-shell/75 transition-colors hover:text-off-white focus:outline-none focus-visible:text-off-white focus-visible:ring-2 focus-visible:ring-warm-amber/35 focus-visible:ring-offset-4 focus-visible:ring-offset-deep-brown"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-shell/10 pt-8">
          <p className="text-center text-xs text-shell/50">
            &copy; {new Date().getFullYear()} ArcVane Studio. All rights reserved. LED bulbs only.
          </p>
        </div>
      </div>
    </footer>
  );
}
