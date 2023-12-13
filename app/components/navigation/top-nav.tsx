import { useNavigate } from '@remix-run/react';
import { Clapperboard } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';

import { ListItem } from './list-item';

const abouts: {
  title: string;
  to: string;
  description: string;
}[] = [
  {
    title: 'Frontend',
    to: '#',
    description:
      'Frontend created using Remix.run + shadcn/ui + Tailwind + Spline.',
  },
  {
    title: 'Backend',
    to: '#',
    description:
      'Backend created using Node.js and Passport.js for authentication.',
  },
  {
    title: 'Model',
    to: '#',
    description: "Model's backend runs on a Flask server.",
  },
  {
    title: 'App',
    to: '#',
    description: 'Flutter leveraged for cross-platform development.',
  },
  {
    title: 'MongoDB',
    to: '#',
    description:
      'The database used for storing relevant information.',
  },
  {
    title: 'Prisma',
    to: '#',
    description: 'Used Prisma as an Object Relational Mapper.',
  },
];

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <NavigationMenu className='flex m-auto'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} hover:cursor-pointer`}
            onClick={() =>
              navigate('/', {
                replace: true,
              })
            }
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
              {abouts.map((about) => (
                <ListItem
                  key={about.title}
                  title={about.title}
                  to={about.to}
                >
                  {about.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md font-sans'
                    href='/'
                  >
                    <Clapperboard />
                    <div className='mb-2 mt-4 text-lg font-bold'>
                      Our Services
                    </div>
                    <p className='text-sm leading-tight text-muted-foreground font-medium'>
                      Choose what you want.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem to='/recommend' title='Recommend a Movie'>
                Find tailored recommendations similar to the movie you
                choose.
              </ListItem>
              <ListItem to='/trending' title='Currently Trending'>
                Find the trending movies of the day.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} hover:cursor-pointer`}
            onClick={() => navigate('/login')}
          >
            Login
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
