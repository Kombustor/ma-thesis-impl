import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'react-daisyui';

import { useScrollPosition } from '@/components/hooks/useScrollPosition';
import InfoBlock from '@/components/landing/InfoBlock';
import TriangleDivider from '@/components/landing/TriangleDivider';
import NavBar from '@/components/layout/NavBar';
import NavMenu from '@/components/layout/NavMenu';
import Navigation from '@/components/layout/Navigation';
import MainLayout, { MAIN_NAV_ITEMS } from '@/layouts/MainLayout';

import { classNames } from '@mbg/ui';

import image1 from '../../public/landing/1.webp';
import image2 from '../../public/landing/2.svg';
import image3 from '../../public/landing/3.svg';
import image4 from '../../public/landing/4.svg';
import image5 from '../../public/landing/5.svg';
import image6 from '../../public/landing/6.svg';
import image7 from '../../public/landing/7.svg';
import image8 from '../../public/landing/8.svg';
import image9 from '../../public/landing/9.svg';
import image10 from '../../public/landing/10.svg';
import image11 from '../../public/landing/11.svg';
import image12 from '../../public/landing/12.svg';

export default function LandingPage() {
  const scrollPosition = useScrollPosition();
  return (
    <MainLayout
      container={false}
      headerClassNames={classNames('sticky top-0 z-10')}
      footerClassNames="bg-primary text-white"
      navigation={
        <Navigation
          className={classNames('transition-all', {
            'bg-primary text-primary-content': scrollPosition === 0,
            'bg-base-100 shadow-md': scrollPosition > 0,
          })}
          navBarCenter={
            <NavBar
              items={MAIN_NAV_ITEMS}
              normalClasses={classNames('transition-all', {
                'text-primary-content': scrollPosition === 0,
                'text-neutral': scrollPosition > 0,
              })}
              activeClasses={classNames('transition-all', {
                'bg-primary-focus': scrollPosition === 0,
                'bg-base-200': scrollPosition > 0,
              })}
            />
          }
          navBarEnd={<NavMenu items={MAIN_NAV_ITEMS} />}
        />
      }
    >
      <Head>
        <meta
          name="description"
          content="NewsUnfold helps you to read news critically and actively question what you are reading. By making media bias and slanted content visible through our AI, you can easily estimate the trustworthiness of the news."
          key="description"
        />
        <meta
          property="og:description"
          content="NewsUnfold helps you to read news critically and actively question what you are reading. By making media bias and slanted content visible through our AI, you can easily estimate the trustworthiness of the news."
          key="ogdescription"
        />
        <meta property="og:image" content="/teaser.png" key="image" />
      </Head>

      <div className="bg-primary">
        <div className="container mx-auto flex flex-row flex-wrap justify-between gap-8 py-12 text-white">
          <div className="flex flex-col justify-center gap-8 text-xl md:basis-1/2">
            <h1 className="text-3xl font-extrabold">
              Media Bias and Misinformation are global problems.
            </h1>
            <p>
              Biased language and one-sided reporting can influence and alter
              the world views of news readers, leading to polarization, filter
              bubbles, and echo chambers.
            </p>
            <Link href="/articles">
              <Button
                className="text-white"
                color="secondary"
                variant="outline"
                size="md"
              >
                Read bias-aware now!
              </Button>
            </Link>
          </div>
          <div className="md:basis-1/3">
            <Image alt="Summary" src={image1} sizes="33vw" />
          </div>
        </div>
      </div>

      <TriangleDivider className="-mt-4 mb-8 rotate-180" />

      <div className="container mx-auto flex flex-col lg:gap-8 lg:py-8">
        <InfoBlock
          image={<Image alt="Feature overview" src={image2} />}
          text={
            <>
              <p>
                NewsUnfold can help you to read more critically and actively
                question the news you are reading. By visually uncovering
                slanted content, we empower you to accurately assess the
                trustworthiness of the news you read.
              </p>
              <p>
                Join us in the fight against manipulative language and biased
                news content! Your feedback and opinions can help us fine-tune
                our systems and help more people to be less susceptible to media
                bias.
              </p>
              <div>
                <Link href="/articles">
                  <Button
                    className="umami--click--landing-read-now"
                    color="primary"
                    size="md"
                  >
                    Test it now
                  </Button>
                </Link>
              </div>
            </>
          }
        />

        <InfoBlock
          reverse
          image={<Image alt="Our mission" src={image3} />}
          text={
            <>
              <h1 className="text-3xl font-extrabold">Our Mission</h1>
              <p>
                NewsUnfold counters one-sided reporting with a novel approach
                that combines computer science and social science. In a sea of
                information overload, we provide the tools to see beyond the
                surface.
              </p>
            </>
          }
        />

        <InfoBlock
          image={<Image alt="NewsUnfold Algorithms" src={image4} />}
          text={
            <>
              <p>
                The NewsUnfold algorithm is designed to identify biased
                language. Further, we analyze the credibility of a new outlet,
                along with the objectivity of the article.
              </p>
              <p>
                Our mission is to understand how to effectively tackle the
                growing issue of biased and polarizing news content in
                today&apos;s online media landscape.
              </p>
            </>
          }
        />

        <div className="flex flex-col gap-8 py-8">
          <h1 className="text-3xl font-extrabold">What we do</h1>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {[
              ['Detect Bias', image5],
              ['Visualize Bias', image6],
              ['Perspective', image7],
              ['News Nutrition', image8],
              ['Credibility', image9],
              ['Objectivity', image10],
            ].map(([item, image], index) => (
              <div
                key={index}
                className="flex flex-col justify-between bg-white"
              >
                <Image alt={item} src={image} />
                <h2 className="bg-primary w-full py-4 px-8 text-center text-xl font-extrabold text-white">
                  {item}
                </h2>
              </div>
            ))}
          </div>
        </div>

        <InfoBlock
          reverse
          image={<Image alt="Our Research" src={image11} />}
          text={
            <>
              <h1 className="text-3xl font-extrabold">Our Research</h1>
              <p>
                NewsUnfold is the result of three iterations, each assessed
                through a controlled study. From testing various feedback
                mechanisms to refining our visualizations, we have arrived at
                the final website that you see today.
              </p>
              <div className="flex flex-row gap-2">
                <Link href="/articles">
                  <Button color="primary" size="md">
                    Test it now
                  </Button>
                </Link>
                <Link href="/media-bias">
                  <Button
                    className="umami--click--landing-learn-more-bias"
                    color="primary"
                    variant="outline"
                    size="md"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </>
          }
        />

        <InfoBlock
          image={<Image alt="Media Bias Group" src={image12} />}
          text={
            <>
              <p>
                NewsUnfold is a project of the Media Bias Group, a young and
                interdisciplinary research group dedicated to battling slanted
                reporting and fostering a well-informed, critically-thinking
                public.
              </p>
              <p>
                Our strategy focuses on developing methods for media bias
                detection and visualization, and implementing them in
                easy-to-use products that promote bias awareness and media
                literacy.
              </p>
              <a
                className="umami--click--landing-mbg"
                href="https://media-bias-research.org"
                target="_blank"
                rel="noreferrer"
              >
                <Button color="primary" variant="outline" size="md">
                  Learn more
                </Button>
              </a>
            </>
          }
        />
      </div>

      <TriangleDivider className="-mb-4 mt-8" />
    </MainLayout>
  );
}
