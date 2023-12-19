import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type ActorDirectorCardProps = {
  imagePath: string;
  name: string;
  role: string;
};

export function ActorDirectorCard({
  imagePath,
  name,
  role,
}: ActorDirectorCardProps) {
  return (
    <div className='flex flex-col'>
      <img
        src={imagePath}
        alt={name}
        className='object-cover max-h-60 lg:max-h-80 rounded-md'
        loading='lazy'
      />
      <Card>
        <CardHeader>
          <CardTitle className='m-auto text-xl sm:text-2xl md:text-4xl text-center'>
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className='w-fit m-auto'>
          <Badge className='text-sm md:text-lg text-center'>
            {role}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
