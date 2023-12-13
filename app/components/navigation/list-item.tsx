import { useNavigate } from '@remix-run/react';
import React from 'react';

import { cn } from '~/lib/utils';
import { NavigationMenuLink } from '../ui/navigation-menu';

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  to: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  ListItemProps
>(({ className, title, children, to, ...props }, ref) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (to === '#') return;

    navigate(to);
  };

  return (
    <li>
      <NavigationMenuLink asChild onClick={handleNavigate}>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:cursor-pointer',
            className
          )}
          {...props}
        >
          <div className='text-sm font-sans font-bold leading-none'>
            {title}
          </div>
          <p className='line-clamp-2 text-sm font-sans font-medium leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export { ListItem };
