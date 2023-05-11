import { ImageLoaderProps } from 'next/image';

export default function wsrvImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `https://wsrv.nl/?url=${src}&q=${quality || 75}${
    width ? `&w=${width}` : ''
  }`;
}
