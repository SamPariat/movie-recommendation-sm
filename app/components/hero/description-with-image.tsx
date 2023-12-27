import { motion, Variants } from 'framer-motion';

type DescriptionWithImageProps = {
  title: string;
  description: string;
  src: string;
  alt: string;
};

const imageVariants: Variants = {
  hover: {
    scale: 1.02,
  },
};

export function DescriptionWithImage({
  title,
  description,
  src,
  alt,
}: DescriptionWithImageProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 space-x-4'>
      <div className='col-span-1 md:col-span-2 xl:col-span-3'>
        <h1 className='font-sans font-bold text-5xl md:text-6xl lg:text-7xl mb-8'>
          {title}
        </h1>
        <h2 className='font-sans font-semibold text-xl sm:text-2xl lg:text-3xl mb-4'>
          {description}
        </h2>
      </div>
      <motion.img
        src={src}
        alt={alt}
        className='object-contain h-0 md:h-96 md:col-span-2 lg:col-span-3 lg:col-start-4'
        variants={imageVariants}
        whileHover='hover'
        loading='lazy'
      />
    </div>
  );
}
