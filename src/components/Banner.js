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
    <div className={`relative w-full leading-[0] ${className}`}>
      {/* Desktop container - only show above 1000px */}
      <div className="hidden lg:block w-full leading-[0]">
        <Image
          src={desktopImage}
          alt={alt}
          width={1920}
          height={420}
          className="w-full h-auto block"
          priority={priority}
          sizes="100vw"
          quality={90}
          style={{ display: 'block', verticalAlign: 'bottom' }}
        />
      </div>

      {/* Mobile/Tablet container - show below 1000px */}
      <div className="block lg:hidden w-full leading-[0]">
        {mobileImage ? (
          <Image
            src={mobileImage}
            alt={alt}
            width={768}
            height={420}
            className="w-full h-auto block"
            priority={priority}
            sizes="100vw"
            quality={90}
            style={{ display: 'block', verticalAlign: 'bottom' }}
          />
        ) : (
          <Image
            src={desktopImage}
            alt={alt}
            width={768}
            height={420}
            className="w-full h-auto block"
            priority={priority}
            sizes="100vw"
            quality={90}
            style={{ display: 'block', verticalAlign: 'bottom' }}
          />
        )}
      </div>
    </div>
  );
}
