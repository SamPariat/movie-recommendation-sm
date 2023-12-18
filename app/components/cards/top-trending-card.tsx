import { useNavigate } from '@remix-run/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Variants, motion } from 'framer-motion';

type TopTrendingCardProps = {
  id: number;
  title: string;
  tagline: string;
  adult: boolean;
  imagePath: string;
  genres: (number | string)[];
};

const topTrendingCardVariants: Variants = {
  hover: {
    opacity: 0.8,
  },
};

export function TopTrendingCard({
  id,
  title,
  tagline,
  adult,
  imagePath,
  genres,
}: TopTrendingCardProps) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col mx-0 md:mx-10 xl:mx-16'>
      <motion.img
        src={imagePath}
        alt={title}
        className='object-cover max-h-96 rounded-lg'
        variants={topTrendingCardVariants}
        whileHover='hover'
      />
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl md:text-5xl'>
            {title}
          </CardTitle>
          <span className='flex space-x-2 justify-around'>
            {genres.map((genre) => (
              <Badge
                key={`${title}-${genre}`}
                className='w-fit text-xs lg:text-sm text-center'
              >
                {genre}
              </Badge>
            ))}
          </span>
          <CardDescription className='text-lg'>
            {adult ? 'Restricted' : 'General Audience'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm md:text-lg'>{tagline}</p>
        </CardContent>
        <CardFooter className='flex justify-around'>
          <Button
            size='sm'
            className='font-semibold'
            variant='ghost'
            onClick={() => navigate(`/movie/${id}`)}
          >
            Movie Information
          </Button>
          <Button
            size='sm'
            className='font-semibold'
            variant='ghost'
            onClick={() => navigate(`/movie/${id}/reviews`)}
          >
            User Reviews
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
