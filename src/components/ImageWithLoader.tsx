'use client';

import { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ImageWithLoaderProps extends ImageProps {
  loaderClassName?: string;
}

export default function ImageWithLoader({
  className = '',
  loaderClassName = '',
  onLoad,
  src,
  style,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-brand-black ${loaderClassName}`}>
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-gold/30 border-t-brand-gold" />
        </div>
      )}
      <Image
        {...props}
        src={src}
        className={className}
        style={{ ...style, opacity: loaded ? style?.opacity : 0 }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </>
  );
}
