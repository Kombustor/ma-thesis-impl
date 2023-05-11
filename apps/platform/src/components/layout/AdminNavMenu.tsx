import Link from 'next/link';
import { Menu } from 'react-daisyui';

import { findOverlap } from '@/lib/find-overlap';

import { classNames } from '@mbg/ui';

type NavBarItem = {
  name: string;
  link: string;
  icon: React.ReactElement;
};

type Props = {
  items: NavBarItem[];
};

export default function AdminNavMenu({ items }: Props) {
  return (
    <Menu horizontal className="bg-base-100 gap-1 rounded-lg p-2">
      {items.map((item) => (
        <Menu.Item
          className={classNames(
            {
              'bg-base-200':
                window.location.pathname.startsWith(item.link) &&
                item.link.length ===
                  Math.max(
                    ...items.map(
                      ({ link }) =>
                        findOverlap(window.location.pathname, link).length
                    )
                  ),
            },
            'rounded-lg'
          )}
          key={item.name}
        >
          <Link href={item.link} key={item.name}>
            <span>
              {item.icon}
              {item.name}
            </span>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}
