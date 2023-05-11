import TextElement from '@/components/article/admin/TextElement';

import { HtmlType } from '@mbg/api-platform/models/enums';
import { Content } from '@mbg/api-platform/schemas/content.schema';
import { classNames } from '@mbg/ui';

export type Props = {
  contents: Content[];
  selectedContentIds: string[];
  setSelectedContentIds: (elem: string[]) => void;
  inferenceAvailable: boolean;
  classifierView: boolean;
};

export default function ShowContent({
  contents,
  selectedContentIds,
  setSelectedContentIds,
  inferenceAvailable,
  classifierView,
}: Props) {
  let currParagraph = 0;
  return (
    <div>
      {contents.map((c) => {
        const { id, paragraphIndex, htmlType } = c;
        const setLineBreak = currParagraph !== paragraphIndex;
        const isHeading = [HtmlType.H1, HtmlType.H2, HtmlType.H3].includes(
          htmlType as HtmlType
        );
        if (!isHeading && paragraphIndex) {
          currParagraph = paragraphIndex;
        }
        return (
          <div
            key={id}
            className={classNames({
              inline: !isHeading,
              'block mt-2': isHeading,
            })}
          >
            <TextElement
              content={c}
              onClick={() => {
                const elem_idx = selectedContentIds.find((elem) => elem === id);
                if (elem_idx) {
                  setSelectedContentIds(
                    selectedContentIds.filter((elem) => elem !== id)
                  );
                } else {
                  setSelectedContentIds([...selectedContentIds, id]);
                }
              }}
              selected={selectedContentIds.includes(id)}
              isHeading={isHeading}
              inferenceAvailable={inferenceAvailable}
              classifierView={classifierView}
            />
            {!isHeading && setLineBreak && <br className="mt-2 block" />}
          </div>
        );
      })}
    </div>
  );
}
