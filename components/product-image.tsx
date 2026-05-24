// components/product-image.tsx
// Safe product image rendering for local assets, configured remote hosts, arbitrary external URLs, and empty image lists.

/* eslint-disable @next/next/no-img-element -- Admin-entered external URLs are intentionally supported without requiring a static allow-list. */

import Image from "next/image";

const PRODUCT_IMAGE_PLACEHOLDER = "/og-product-placeholder.svg";

function isAbsoluteHttpUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isKnownOptimizedRemote(src: string): boolean {
  try {
    const url = new URL(src);
    return url.hostname === "cdn.shopify.com" || url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

type ProductImageProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function productImageSrc(src?: string | null): string {
  const trimmed = typeof src === "string" ? src.trim() : "";
  return trimmed || PRODUCT_IMAGE_PLACEHOLDER;
}

export function ProductImage({
  src,
  alt,
  fill = false,
  className,
  sizes,
  priority = false,
}: ProductImageProps) {
  const imageSrc = productImageSrc(src);
  const shouldUseNextImage = imageSrc.startsWith("/") || isKnownOptimizedRemote(imageSrc);

  if (shouldUseNextImage) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (isAbsoluteHttpUrl(imageSrc)) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={PRODUCT_IMAGE_PLACEHOLDER}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
