import type { MetaFunction } from '@remix-run/node';

import {
  CineSuggestIntro,
  DescriptionWithImage,
} from '~/components/hero';

export const meta: MetaFunction = () => {
  return [
    { title: 'CineSuggest' },
    {
      name: 'description',
      content:
        'Welcome to CineSuggest - The movie recommendation and review system',
    },
  ];
};

export default function Index() {
  return (
    <>
      <CineSuggestIntro />
      <DescriptionWithImage
        title='Cosine Similarity'
        description='Unlock a world of personalized movie recommendations using
        the precision of cosine similarity. Your perfect film
        match is just a click away.'
        src='./images/cosine-similarity-3d.png'
        alt='CosineSimilarity.png'
      />
      <DescriptionWithImage
        title='Naive Bayes'
        description='Delve into the emotional pulse of cinema with our
        sentiment analysis powered by Naive Bayes.'
        src='./images/naive-bayes-3d.png'
        alt='NaiveBayes.png'
      />
    </>
  );
}
