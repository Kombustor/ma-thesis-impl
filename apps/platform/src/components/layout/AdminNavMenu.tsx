import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  return (
    <Menu horizontal className="bg-base-100 gap-1 rounded-lg p-2">
      {items.map((item) => (
        <Menu.Item
          className={classNames(
            {
              'bg-base-200':
                router.pathname.startsWith(item.link) &&
                item.link.length ===
                  Math.max(
                    ...items.map(
                      ({ link }) => findOverlap(router.pathname, link).length
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
