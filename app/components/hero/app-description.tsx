import { Variants, motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

const appDescriptionVariants: Variants = {
  initial: {
    rotateY: 0,
    y: -45,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    rotateY: 45,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function AppDescription() {
  return (
    <div className='my-8'>
      <h1 className='font-sans font-bold text-4xl sm:text-5xl lg:text-6xl mb-8'>
        Try the App
      </h1>
      <h2 className='font-sans font-semibold text-xl sm:text-2xl lg:text-3xl mb-4'>
        Being built using Flutter for performance. Stay tuned for an
        on-the-go way for engagement.
      </h2>
      <Button variant='ghost' size='default'>
        Download
        <Download className='ml-2 h-4 w-4' />
      </Button>
      <motion.img
        className='object-contain h-0 md:h-[750px] m-auto'
        src='./images/try-app-3d.png'
        alt='TryApp.png'
        variants={appDescriptionVariants}
        initial='initial'
        whileHover='hover'
      />
    </div>
  );
}
