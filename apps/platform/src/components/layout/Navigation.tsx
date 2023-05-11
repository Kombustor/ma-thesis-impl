import React from 'react';
import { Button, Navbar } from 'react-daisyui';

type Props = {
  hidePlatform?: boolean;
  navBarCenter?: React.ReactNode;
  navBarEnd?: React.ReactNode;
};

export default function Navigation({
  hidePlatform,
  navBarCenter,
  navBarEnd,
}: Props) {
  return (
    <Navbar className="w-full py-0">
      <Navbar.Start>
        {!hidePlatform && (
          <Button className="text-xl normal-case">MBG Platform</Button>
        )}
      </Navbar.Start>
      <Navbar.Center>{navBarCenter}</Navbar.Center>
      <Navbar.End>{navBarEnd}</Navbar.End>
    </Navbar>
  );
}
