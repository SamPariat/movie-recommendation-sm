import { useNavigate } from '@remix-run/react';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Variants, motion } from 'framer-motion';

type MovieCardProps = {
  id: number;
  title: string;
  tagline: string;
  adult: boolean;
  imagePath: string;
  genres: string[];
};

const movieCardVariants: Variants = {
  hover: {
    opacity: 0.8,
    y: -5,
  },
};

export function MovieCard({
  id,
  title,
  tagline,
  adult,
  imagePath,
  genres,
}: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      className='flex flex-col h-auto cursor-pointer'
      onClick={() => navigate(`/movie/${id}`)}
      variants={movieCardVariants}
      whileHover='hover'
    >
      <img
        src={imagePath}
        alt={title}
        className='object-cover max-h-48 lg:max-h-96 rounded-md'
      />
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className='flex justify-between'>
            {genres.map((genre) => (
              <Badge
                key={`${title}-${genre}`}
                className='w-fit text-center'
              >
                {genre}
              </Badge>
            ))}
          </div>
          <CardDescription>
            {adult ? 'Restricted' : 'General Audience'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-xs line-clamp-2'>{tagline}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
