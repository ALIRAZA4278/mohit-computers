'use client';

import Image from 'next/image';

export default function Banner({
  desktopImage,
  mobileImage,
  alt = "Banner",
  height = "400px",
  className = "",
  priority = false
}) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop container - only show above 1280px (when navbar menu is hidden) */}
      <div className="hidden xl:block relative w-full aspect-[1920/420]">
        <Image
          src={desktopImage}
          alt={alt}
          fill
          className="object-contain"
          priority={priority}
          sizes="100vw"
          quality={90}
        />
      </div>

      {/* Mobile/Tablet container - show below 1280px (when navbar menu button appears) */}
      <div className="block xl:hidden relative w-full aspect-square">
        {mobileImage ? (
          <Image
            src={mobileImage}
            alt={alt}
            fill
            className="object-contain"
            priority={priority}
            sizes="100vw"
            quality={90}
          />
        ) : (
          <Image
            src={desktopImage}
            alt={alt}
            fill
            className="object-contain"
            priority={priority}
            sizes="100vw"
            quality={90}
          />
        )}
      </div>
    </div>
  );
}