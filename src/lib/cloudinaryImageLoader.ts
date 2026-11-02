import type { ImageLoader } from 'next/image';

/** Ask Cloudinary for a browser-ready image sized for the rendered slot. */
const cloudinaryImageLoader: ImageLoader = ({ src, width }) => {
  if (!src.includes('res.cloudinary.com/')) return src;

  const uploadSegment = '/upload/';
  const uploadIndex = src.indexOf(uploadSegment);
  if (uploadIndex === -1) return src;

  const transformations = `f_auto,q_auto:good,c_limit,w_${width}`;
  return `${src.slice(0, uploadIndex + uploadSegment.length)}${transformations}/${src.slice(uploadIndex + uploadSegment.length)}`;
};

export default cloudinaryImageLoader;
