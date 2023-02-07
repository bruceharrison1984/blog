import { CertificationList } from '@/components/certificationList/CertificationList';
import { CredlyCertificate } from '@/types/CredlyCertificates';
import { GetStaticProps } from 'next';
import { getCertifications } from '@/utils/certificateFetcher';
import Image from 'next/image';
import Link from 'next/link';

const About = ({ certifications }: { certifications: CredlyCertificate[] }) => {
  return (
    <div className="space-y-6">
      <div className="prose-sm md:prose mx-auto shadow-lg rounded-lg bg-white bg-opacity-25 px-5 pt-5">
        <Image
          alt={'linkedin_logo'}
          src={'/assets/about/headshot-1.webp'}
          height={128}
          width={128}
          quality={100}
          className="rounded-full border-solid border-black border-opacity-40 border-2 mx-auto shadow-lg"
        />
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl -mt-5">Bruce Lee Harrison</span>
        </div>
        <p className="indent-4">
          I am a software developer from St. Louis, who lives in the Midwest.
          Growing up, I was always fascinated with machines and technology.
          These interests have taking me down a wide variety industries, helping
          me build a strong foundation of technological skills from low/high
          voltage electronics, pneumatics, hydraulics, and finally computer
          programming. The aggregate result of this experience helps give me a
          unique approach to problem solving.
        </p>
        <p className="indent-4">
          I started my technology career at a small business. Typical of many
          small businesses, I wore many hats. I worked as the network
          administrator, desktop support, in-house developer, web site
          administrator, systems administrator, and domain administrator.
          Additionally, I had to maintain the VOIP system as well as the
          low-voltage access control system. These days I work more as a
          full-stack cloud developer, but my need to learn everything about a
          given environment certainly has roots in my beginnings.
        </p>
        <p className="indent-4">
          As a full-stack developer I get the enjoyment of in-the-trenches
          coding, and the high-level architect point of view. I find it
          particularly enjoyable setting up CI/CD workflows, and seeing
          developers faces light up when a simple push to the master branch
          triggers a full-scale deployment. I was fortunate to be given access
          to AWS in its formative days, and got to witness the growth of the
          various cloud providers and their offerings first hand.
        </p>
        <p className="indent-4">
          My LinkedIn page contains a more up-to-date listing of my employment
          and skills, check it out if you are interested in knowing more about
          me!
        </p>
        <div className="flex justify-end space-x-2">
          <Link href="https://github.com/bruceharrison1984" target="_blank">
            <Image
              alt={'github_logo'}
              src={'/assets/github_logo.png'}
              height={28}
              width={28}
              quality={100}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/in/bruceleeharrison/"
            target="_blank"
          >
            <Image
              alt={'linkedin_logo'}
              src={'/assets/linkedin_logo.png'}
              height={28}
              width={28}
              quality={100}
            />
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div>
          <CertificationList certifications={certifications} />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const certifications = await getCertifications();

  return {
    props: {
      certifications,
    },
  };
};

export default About;
