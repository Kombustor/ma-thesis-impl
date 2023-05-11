/* eslint-disable unicorn/filename-case */
import { Step } from 'react-joyride';

export const TUTORIAL_STEPS_INDEX: Step[] = [
  {
    target: '.article-grid',
    placement: 'bottom',
    content:
      "Welcome to NewsUnfold! Let's start with a quick walkthrough that will show you how to get the best out of the news you consume!",
    disableOverlayClose: true,
  },
  {
    target: '.article-grid :nth-child(1)',
    content: "Let's begin by clicking on the first article.",
    spotlightClicks: true,
    disableOverlayClose: true,
  },
];

export const TUTORIAL_STEPS_ARTICLE: Step[] = [
  {
    target: '.main-article',
    placement: 'bottom',
    content:
      'This is the article view. See those yellow and grey highlights? If a sentence is yellow, that means we detected bias in the sentence! You might want to read it more cautiously. The wording and slant of the article might distort your view of the event otherwise.',
  },
  {
    target: '.media-bias-navitem',
    spotlightClicks: false,
    content:
      'If you want to learn more about media bias, check out our info page after the tutorial!',
  },
  {
    target: '.article-summary',
    content: (
      <div>
        <p>
          Here, you can see the most important info about the article at one
          glance.
        </p>
        <p>
          The Bias Gauge lets you know how much biased language we detected in
          the article so you can read accordingly.
        </p>
        <p>
          Also, you can see if the outlet is trustworthy (according to AdFontes
          Media).
        </p>
        <p>
          Lastly, you see if the article is written objectively or if it is
          opinionated!
        </p>
      </div>
    ),
  },
  {
    target: '.feedback-box',
    content:
      'We generate the text highlights automatically, so they might be wrong from time to time. You can click on sentences and help us here by agreeing or disagreeing. This helps us to improve in the future!',
  },
  {
    target: '.questionnaire-link',
    content:
      'If you want to help us further with our research after you took a look at NewsUnfold, share your opinion in our short survey.',
  },
  {
    target: '.recommended-articles',
    content:
      'Lastly, you can see recommended articles and choose your next read!',
  },
];
