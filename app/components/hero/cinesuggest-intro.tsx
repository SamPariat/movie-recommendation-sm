import { useNavigate } from '@remix-run/react';
import { Variants, motion } from 'framer-motion';
import { SkipForward } from 'lucide-react';

import { Button } from '~/components/ui/button';

const imageVariants: Variants = {
  hover: {
    y: -2.5,
  },
};

export function CineSuggestIntro() {
  const navigate = useNavigate();

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 space-x-4'>
      <div className='col-span-1 md:col-span-2 xl:col-span-3'>
        <h1 className='font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8'>
          CineSuggest
        </h1>
        <h2 className='font-semibold text-xl sm:text-3xl lg:text-4xl mb-4'>
          Experience movie magic with our cutting-edge recommendation
          and review system, powered by advanced machine learning
          algorithms.
        </h2>
        <Button
          size='lg'
          variant='default'
          className='font-semibold text-md md:text-lg'
          onClick={() => navigate('/trending')}
        >
          Get Started
          <SkipForward className='ml-2 h-4 w-4' />
        </Button>
        <p className='text-xs font-medium my-2'>
          Note that recommendations are only available for movies that
          released before 2019...
        </p>
      </div>
      <motion.img
        src='./images/cinesuggest-3d-image-red.png'
        alt='CineSuggest.png'
        className='object-contain h-0 md:h-96 md:col-span-2 lg:col-span-3 lg:col-start-4'
        loading='lazy'
        variants={imageVariants}
        whileHover='hover'
      />
    </div>
  );
}
