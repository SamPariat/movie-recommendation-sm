import { useNavigate } from '@remix-run/react';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type MovieCardProps = {
  id: number;
  title: string;
  tagline: string;
  adult: boolean;
  imagePath: string;
  genres: string[];
};

export default function MovieCard({
  id,
  title,
  tagline,
  adult,
  imagePath,
  genres,
}: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className='flex flex-col h-auto cursor-pointer'
      onClick={() => navigate(`/movie/${id}`)}
    >
      <img
        src={imagePath}
        alt={title}
        className='object-cover max-h-48 lg:max-h-96 rounded-md'
      />
      <Card>
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
    </div>
  );
}
