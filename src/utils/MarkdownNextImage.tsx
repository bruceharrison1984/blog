import Image from 'next/image';

/**
 * This component is used to override the default img component via mdx-bundler
 * and replace it with a NextJS Image component. Image sizes are automatically
 * computed by the `rehype-img-size` package and inserted into the DOM.
 * @param param0 React.ImgHTMLAttributes<HTMLImageElement>
 * @returns next/image component
 */
export const MarkdownNextImage = ({
  src,
  className,
  height,
  width,
  alt,
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <Image
    className={`${className} rounded-lg mx-auto`}
    src={src!}
    height={height as number}
    width={width as number}
    alt={alt!}
  />
);
