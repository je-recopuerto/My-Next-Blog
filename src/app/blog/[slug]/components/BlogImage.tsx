'use client';

import Image from "next/image";
import { useOptimizeImage } from "../../../hooks/useOptimizeImage";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BlogImage({ src, alt, className }: BlogImageProps) {
  return (
    <Image
      width={800}
      height={400}
      src={useOptimizeImage(src) || "/blog/asset1.jpg"}
      alt={alt}
      className={className}
      unoptimized
    />
  );
}