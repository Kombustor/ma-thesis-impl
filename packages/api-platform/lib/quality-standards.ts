import type { Article } from '@prisma/client-platform';

import { OverallRating, QualityStandards } from '../schemas/article.schema';
import { SETUP_CONFIG } from '../setupconfig';

type ArticleQualityStandards = Pick<
  Article,
  'biasPercentage' | 'sitename' | 'credibleSource' | 'omitsOpinion'
>;

type QualityStandardReturn<T extends keyof QualityStandards> =
  | {
      metStandard: boolean;
      value: QualityStandards[T];
    }
  | undefined;

export function getQualityStandards(
  article: ArticleQualityStandards
): QualityStandards {
  const languageStandard = getLanguage(article);
  const reportingStandard = getReporting(article);
  const objectivityStandard = getObjectivity(article);

  const standards = [languageStandard, reportingStandard, objectivityStandard];

  const totalQualityStandards = standards.filter(
    (standard) => !!standard
  ).length;
  const metQualityStandards = standards.filter(
    (standard) => standard?.metStandard
  ).length;
  const unmetStandards = totalQualityStandards - metQualityStandards;
  const rating =
    unmetStandards === 0
      ? OverallRating.RELIABLE
      : (unmetStandards === 1
      ? OverallRating.QUESTIONABLE
      : OverallRating.UNRELIABLE);

  return {
    summary: {
      rating,
      metQualityStandards,
      totalQualityStandards,
    },
    language: languageStandard?.value,
    reporting: reportingStandard?.value,
    objectivity: objectivityStandard?.value,
  };
}

function getLanguage({
  biasPercentage,
}: ArticleQualityStandards): QualityStandardReturn<'language'> {
  // Language
  if (biasPercentage !== null) {
    return {
      metStandard: biasPercentage <= SETUP_CONFIG.articles.maxBiasPercentage,
      value: {
        biasPercentage,
        label:
          biasPercentage <= SETUP_CONFIG.articles.biasThresholds[0]
            ? 'Low Bias'
            : (biasPercentage <= SETUP_CONFIG.articles.biasThresholds[1]
            ? 'Medium Bias'
            : 'High Bias'),
      },
    };
  }
}

function getReporting({
  sitename,
  credibleSource,
}: ArticleQualityStandards): QualityStandardReturn<'reporting'> {
  // Reporting
  if (sitename && credibleSource !== null) {
    return {
      metStandard: credibleSource,
      value: {
        source: sitename,
        credibleSource,
      },
    };
  }
}

function getObjectivity({
  omitsOpinion,
}: ArticleQualityStandards): QualityStandardReturn<'objectivity'> {
  // Objectivity
  if (omitsOpinion !== null) {
    return {
      metStandard: omitsOpinion,
      value: {
        omitsOpinion,
      },
    };
  }
}
