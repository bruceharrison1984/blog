import { CredlyCertificate } from '@/types/CredlyCertificates';

/**
 * Get all current and valid certifications
 * @returns CredlyCertificate[]
 */
export const getCertifications = async () => {
  const getCertificates = await fetch(
    'https://www.credly.com/users/bruce-harrison/badges?sort=most_popular&page=1',
    { headers: { accept: 'application/json' } }
  );

  const certificates = (await getCertificates.json())
    .data as CredlyCertificate[];

  return certificates.filter(
    (x) => (x.expires_at ? new Date(x.expires_at) > new Date() : true) // certificates without expiration last forever
  );
};
