import { Button, Dropdown } from 'react-daisyui';
import { HiMenu } from 'react-icons/hi';

import NavBar from '@/components/layout/NavBar';

export type NavBarItem = {
  name: string;
  link: string;
  icon: React.ReactElement;
  additionalClasses?: string;
};

export type NavMenuProps = {
  items: NavBarItem[];
  normalClasses?: string;
  activeClasses?: string;
};

export default function NavMenu({
  activeClasses = 'bg-primary-focus text-primary-content',
  ...props
}: NavMenuProps) {
  return (
    <Dropdown className="dropdown-end lg:hidden">
      <Button color="ghost" tabIndex={0}>
        <HiMenu size="1.5rem" />
      </Button>
      <Dropdown.Menu className="w-64" tabIndex={0}>
        <NavBar horizontal={false} activeClasses={activeClasses} {...props} />
      </Dropdown.Menu>
    </Dropdown>
  );
}
