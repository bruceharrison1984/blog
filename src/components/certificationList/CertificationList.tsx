import { CredlyCertificate } from '@/types/CredlyCertificates';
import Image from 'next/image';
import Link from 'next/link';

export const CertificationList = ({
  certifications,
}: {
  certifications: CredlyCertificate[];
}) => (
  <div className="flex space-x-5">
    {certifications.map((x) => (
      <Link
        key={x.id}
        href={`https://www.credly.com/badges/${x.id}/public_url`}
        target="_blank"
      >
        <Image src={x.image_url} height={96} width={96} alt={x.accepted_at} />
      </Link>
    ))}
  </div>
);
