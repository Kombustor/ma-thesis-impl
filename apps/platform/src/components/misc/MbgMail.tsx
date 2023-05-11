import Link from 'next/link';
import { Link as DLink } from 'react-daisyui';

export default function MBGMail() {
  const mail = 'info@media-bias-group.com';
  return (
    <Link href={`mailto:${mail}`} passHref>
      <DLink target="_blank" className="link-primary">
        {mail}
      </DLink>
    </Link>
  );
}
