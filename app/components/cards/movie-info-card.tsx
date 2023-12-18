import { useNavigate } from '@remix-run/react';

import { IMovieInfo } from '~/types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type MovieInfoCardProps = {
  info: IMovieInfo;
};

export function MovieInfoCard({ info }: MovieInfoCardProps) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col'>
      <h3 className='text-4xl md:text-6xl font-extrabold py-2'>
        {info.title}
      </h3>
      <span className='flex flex-row space-x-4 pb-4'>
        <h6 className='font-semibold'>Release Date:</h6>
        <p>
          {new Date(info.releaseDate).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </span>
      <span className='flex flex-row gap-2 pb-4'>
        {info.genres.map((genre) => (
          <Badge key={genre}>{genre}</Badge>
        ))}
      </span>
      <h5 className='text-2xl md:text-4xl font-bold pb-4'>
        Overview
      </h5>
      <p className='text-sm md:text-base font-thin md:font-extralight line-clamp-4 lg:line-clamp-none max-w-2xl'>
        {info.overview}
      </p>
      <div className='flex flex-col sm:flex-row my-4 gap-4'>
        <Button
          variant='outline'
          onClick={() => navigate('actors-and-directors')}
        >
          Cast Information
        </Button>
        <Button variant='outline' onClick={() => navigate('reviews')}>
          User Reviews
        </Button>
      </div>
    </div>
  );
}
