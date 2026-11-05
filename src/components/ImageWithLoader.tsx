'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import cloudinaryImageLoader from '@/lib/cloudinaryImageLoader';

interface ImageWithLoaderProps extends ImageProps {
  loaderClassName?: string;
}

export default function ImageWithLoader({
  alt,
  className = '',
  loaderClassName = '',
  onLoad,
  src,
  style,
  ...props
}: ImageWithLoaderProps) {
  const imageKey = typeof src === 'string' ? src : JSON.stringify(src);

  return (
    <ImageWithLoaderContent
      key={imageKey}
      {...props}
      alt={alt}
      className={className}
      loaderClassName={loaderClassName}
      onLoad={onLoad}
      src={src}
      style={style}
    />
  );
}

function ImageWithLoaderContent({
  alt,
  className = '',
  loaderClassName = '',
  onLoad,
  src,
  style,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-brand-black ${loaderClassName}`}>
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-gold/30 border-t-brand-gold" />
        </div>
      )}
      <Image
        {...props}
        alt={alt}
        unoptimized={false}
        loader={cloudinaryImageLoader}
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
