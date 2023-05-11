import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from 'react-daisyui';
import {
  HiDatabase,
  HiHome,
  HiNewspaper,
  HiUserGroup,
  HiViewList,
} from 'react-icons/hi';
import { HiMagnifyingGlass } from 'react-icons/hi2';

import AdminNavMenu from '@/components/layout/AdminNavMenu';
import Navigation from '@/components/layout/Navigation';
import MainLayout from '@/layouts/MainLayout';

import { LoadingIndicator } from '@mbg/ui';

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props): React.ReactElement {
  const { status } = useSession({
    required: true,
  });
  if (status === 'loading') {
    return <LoadingIndicator className="h-screen" fullHeight />;
  }
  const items = [
    {
      name: 'Dashboard',
      link: '/admin',
      icon: <HiHome />,
    },
    {
      name: 'Articles',
      link: '/admin/article',
      icon: <HiNewspaper />,
    },
    {
      name: 'Data',
      link: '/admin/data',
      icon: <HiDatabase />,
    },
    {
      name: 'Participants',
      link: '/admin/participants',
      icon: <HiUserGroup />,
    },
    {
      name: 'Prolific',
      link: '/admin/prolific',
      icon: <HiMagnifyingGlass />,
    },
    {
      name: 'Whitelist',
      link: '/admin/whitelist',
      icon: <HiViewList />,
    },
  ];

  return (
    <MainLayout
      navigation={
        <Navigation
          navBarCenter={<AdminNavMenu items={items} />}
          navBarEnd={
            <Button className="text-xl normal-case" onClick={() => signOut()}>
              Log out
            </Button>
          }
        />
      }
    >
      {children}
    </MainLayout>
  );
}
