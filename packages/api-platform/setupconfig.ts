import type { CoverImage } from '@prisma/client-platform';

// Everything in here will be bundled into the frontend so don't include any secret information

export const SETUP_CONFIG = {
  articles: {
    // To be considered reliable, the bias percentage must be below this threshold
    maxBiasPercentage: 0.1,
    // Thresholds of Low, Medium & High bias
    biasThresholds: [0.1, 0.3],
    // Number of recommended articles below article
    numRecommendedArticles: 3,
    placeholderCoverImage: {
      id: 'PLACEHOLDER',
      src: 'https://via.placeholder.com/416x256.png?text=Placeholder',
      width: 416,
      height: 256,
      type: 'png',
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAG0lEQVR4nGNYvmx5GxgsX7acYfmy5T5gAOQAAK58DL0xVe5QAAAAAElFTkSuQmCC',
    } as CoverImage,
    majorityVoteTreshold: 5,
    controverseBias: {
      lowerBound: 0.4,
      upperBound: 0.6,
    },
    maxMarkedPercentage: 0.15,
  },
  questionnaireLink: 'https://forms.gle/g6fbMeMYgsEpeijR9',
};
