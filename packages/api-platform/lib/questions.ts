export enum QuestionType {
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  RANGE,
  NUMBER,
}

type SimpleQuestion = {
  question: string;
};

export type SingleChoiceQuestion = SimpleQuestion & {
  type: QuestionType.SINGLE_CHOICE;
  options: string[];
};

export type MultipleChoiceQuestion = SimpleQuestion & {
  type: QuestionType.MULTIPLE_CHOICE;
  options: string[];
};

export type RangeQuestion = SimpleQuestion & {
  type: QuestionType.RANGE;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  defaultValue: number;
};

export type NumberQuestion = SimpleQuestion & {
  type: QuestionType.NUMBER;
  min: number;
  max: number;
};

type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | RangeQuestion
  | NumberQuestion;

export const QUESTIONS: Record<string, Question> = {
  gender: {
    type: QuestionType.SINGLE_CHOICE,
    question: 'What gender do you identify with? (1/7)',
    options: ['Male', 'Female', 'Other', 'I prefer not to say'],
  },
  age: {
    type: QuestionType.NUMBER,
    question: 'What is your age? (2/7)',
    min: 16,
    max: 80,
  },
  educationLevel: {
    type: QuestionType.SINGLE_CHOICE,
    question: 'What is your level of education? (3/7)',
    options: [
      '8th grade',
      'Some high school',
      'High school graduate',
      'Vocational or technical school',
      'Some college',
      'Associate degree',
      'Bachelor’s degree',
      'Graduate work',
      'Doctoral degree',
      'I prefer not to say',
    ],
  },
  englishLevel: {
    type: QuestionType.SINGLE_CHOICE,
    question: 'What is your level of English proficiency? (4/7)',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  politicalSpectrum: {
    type: QuestionType.RANGE,
    question:
      'Where would you consider yourself on the political spectrum? (5/7)',
    minLabel: 'Very liberal',
    maxLabel: 'Very conservative',
    min: -10,
    max: 10,
    defaultValue: 0,
  },
  newsConsumption: {
    type: QuestionType.SINGLE_CHOICE,
    question: 'How often do you check the news on average? (6/7)',
    options: [
      'Never or very rarely',
      'Several times per month',
      'Several times per week',
      'Once per day',
      'Several times per day',
    ],
  },
  newsOutlets: {
    type: QuestionType.MULTIPLE_CHOICE,
    question:
      'Please select at least one news outlet that you follow or select "I dont follow any news outlets". (7/7)',
    options: [
      'Fox News',
      'New York Times',
      'CNN',
      'MSNBC',
      'Reuters',
      'Breitbart',
      'The Federalist',
      'Huffington Post',
      'New York Post',
      'Alternet',
      'USA Today',
      'ABC News',
      'CBS News',
      'Univision',
      'The Washington Post',
      'The Wall Street Journal',
      'The Guardian',
      'BuzzFeed',
      'Vice',
      'Time magazine',
      'Business Insider',
      "I don't follow any news outlets.",
    ],
  },
};
