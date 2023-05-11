import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu } from 'react-daisyui';

import { NavMenuProps } from '@/components/layout/NavMenu';
import { findOverlap } from '@/lib/find-overlap';

import { classNames } from '@mbg/ui';

type Props = NavMenuProps & {
  horizontal?: boolean;
};

export default function NavBar({
  items,
  horizontal = true,
  normalClasses = 'text-neutral',
  activeClasses = 'bg-base-200',
}: Props) {
  const router = useRouter();

  return (
    <Menu horizontal={horizontal} className="gap-1 rounded-lg p-2">
      {items.map((item) => {
        const isActive =
          router.pathname.startsWith(item.link) &&
          item.link.length ===
            Math.max(
              ...items.map(
                ({ link }) => findOverlap(router.pathname, link).length
              )
            );
        return (
          <Menu.Item
            className={classNames(
              {
                [normalClasses]: !isActive,
                [activeClasses]: isActive,
              },
              'rounded-lg',
              item.additionalClasses
            )}
            key={item.name}
          >
            <Link href={item.link} key={item.name}>
              <span className="flex flex-row items-center font-semibold">
                {item.icon}
                {item.name}
              </span>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}
