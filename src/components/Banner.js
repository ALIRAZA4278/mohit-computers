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
      {/* Responsive height container with different heights for mobile/desktop */}
      <div className="relative w-full">
        {/* Desktop container - only show above 1000px */}
        <div className="hidden lg:block relative w-full">
          <Image
            src={desktopImage}
            alt={alt}
            width={1820}
            height={800}
            className="w-full h-auto"
            priority={priority}
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Mobile/Tablet container - show below 1000px */}
        <div className="block lg:hidden relative w-full">
          {mobileImage ? (
            <Image
              src={mobileImage}
              alt={alt}
              width={768}
              height={500}
              className="w-full h-auto"
              priority={priority}
              sizes="100vw"
              quality={90}
            />
          ) : (
            <Image
              src={desktopImage}
              alt={alt}
              width={768}
              height={500}
              className="w-full h-auto"
              priority={priority}
              sizes="100vw"
              quality={90}
            />
          )}
        </div>
      </div>
    </div>
  );
}
