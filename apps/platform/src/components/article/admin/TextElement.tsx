import { HtmlType } from '@mbg/api-platform/models/enums';
import { Content } from '@mbg/api-platform/schemas/content.schema';
import { classNames } from '@mbg/ui';

type Props = {
  content: Content;
  onClick: () => void;
  selected: boolean;
  isHeading: boolean;
  inferenceAvailable: boolean;
  classifierView: boolean;
};

export default function TextElement({
  content: { htmlType, text, biased, groundTruthBiased },
  onClick,
  selected,
  isHeading,
  inferenceAvailable,
  classifierView,
}: Props) {
  const commonClassNames = classNames(
    'mr-2 hover:dark:text-black cursor-pointer',
    {
      'bg-yellow-300 hover:bg-yellow-400':
        (classifierView && inferenceAvailable && biased) ||
        (!classifierView && groundTruthBiased),
      'bg-green-300 hover:bg-green-400':
        (classifierView && inferenceAvailable && biased === false) ||
        (!classifierView && !groundTruthBiased),
      'bg-red-300 hover:bg-red-400': selected,
      'dark:text-black':
        selected || (inferenceAvailable && biased !== undefined),
    }
  );
  const HtmlTag = (
    htmlType as string
  ).toLowerCase() as keyof JSX.IntrinsicElements;
  return (
    <HtmlTag
      className={classNames(commonClassNames, {
        'mt-0 mb-2 leading-tight inline-block': isHeading,
        'text-2xl': htmlType === HtmlType.H1,
        'text-xl': htmlType === HtmlType.H2,
        'text-lg': htmlType === HtmlType.H3,
      })}
      onClick={onClick}
    >
      {text}
    </HtmlTag>
  );
}
