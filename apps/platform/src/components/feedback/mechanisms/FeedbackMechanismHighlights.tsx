// import type { Feedback } from '@prisma/client-platform';
// import React, { useEffect, useRef, useState } from 'react';
// import { HiCheck, HiX } from 'react-icons/hi';

// import StudyArticle from '@/components/article/study/StudyArticle';
// import ConfirmationModal from '@/components/feedback/ConfirmationModal';
// import { FeedbackMechanismWrapper } from '@/components/feedback/FeedbackMechanismWrapper';
// import { FeedbackIcon } from '@/components/feedback/article/FeedbackIcon';
// import { FeedbackNextButton } from '@/components/feedback/article/FeedbackNextButton';
// import { FeedbackProgress } from '@/components/feedback/article/FeedbackProgress';
// import CenteredFloatingWrapper from '@/components/feedback/box/CenteredFloatingWrapper';
// import FeedbackBox from '@/components/feedback/box/FeedbackBox';
// import { FeedbackButton } from '@/components/feedback/box/FeedbackButton';
// import { FeedbackButtonGroup } from '@/components/feedback/box/FeedbackButtonGroup';
// import { SentenceBiasedText } from '@/components/feedback/box/SentenceBiasedText';
// import { FeedbackMechanismProps } from '@/components/feedback/utils';

// import { trpc } from '@mbg/api-platform/lib/trpc';
// import { HtmlType } from '@mbg/api-platform/models/enums';
// import { classNames } from '@mbg/ui';

// import { ArticleLegend } from '../article/ArticleLegend';

// type HighlightFeedback = Pick<Feedback, 'biased' | 'createdAt'>;

export default function FeedbackMechanismHighlights() {
  return <>TODO</>;
}

// export default function FeedbackMechanismHighlights({
//   topRef,
//   article,
//   isLastArticle,
//   gotoNextArticle,
// }: FeedbackMechanismProps) {
//   const currentSentenceRef = useRef<HTMLSpanElement>(null);
//   // ======= Sentence =======
//   // Current sentence idx defaults to the first span
//   const [currentSentenceIdx, setCurrentSentenceIdx] = useState<
//     number | undefined
//   >(article.contents.findIndex((c) => c.htmlType === HtmlType.SPAN));

//   // Confirmation modal
//   const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

//   // ======= Feedback =======
//   // Tracking feedback sent to the backend at once in the end
//   // Sentence id -> biased
//   const [feedback, setFeedback] = useState<Record<string, HighlightFeedback>>(
//     {}
//   );
//   const createFeedbackMutation = trpc.useMutation('feedback.create-many', {
//     retry: 3,
//   });

//   // Store feedback in State
//   const storeFeedback = (sentenceId: string, biased: boolean) => {
//     setFeedback({
//       ...feedback,
//       [sentenceId]: {
//         biased,
//         createdAt: new Date(),
//       },
//     });
//   };

//   // Move forward when the feedback updates
//   useEffect(() => {
//     if (!currentSentenceIdx || Object.keys(feedback).length === 0) {
//       return;
//     }

//     // Select next non-annotated sentence
//     // eslint-disable-next-line unicorn/no-useless-undefined
//     let nextSentenceIdx = undefined;
//     let searchIdx = currentSentenceIdx + 1;
//     const checkSearchIdxIsValidNext = () => {
//       const sentence = article.contents[searchIdx];
//       if (
//         sentence &&
//         sentence.htmlType === HtmlType.SPAN &&
//         feedback[sentence.id] === undefined
//       ) {
//         nextSentenceIdx = searchIdx;
//         return true;
//       }
//       return false;
//     };
//     while (searchIdx < article.contents.length) {
//       if (checkSearchIdxIsValidNext()) {
//         break;
//       }
//       searchIdx++;
//     }

//     if (nextSentenceIdx === undefined && currentSentenceIdx > 0) {
//       // If we didn't find a next sentence, start searching from the beginning again
//       searchIdx = 0;
//       while (searchIdx < currentSentenceIdx) {
//         if (checkSearchIdxIsValidNext()) {
//           break;
//         }
//         searchIdx++;
//       }
//     }

//     setCurrentSentenceIdx(nextSentenceIdx);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [feedback]);

//   // Submit feedback to API
//   const submitFeedback = async () => {
//     await createFeedbackMutation.mutateAsync(
//       Object.keys(feedback).map((sentenceId: keyof typeof feedback) => ({
//         contentId: sentenceId,
//         basedOnClassifier: true,
//         ...feedback[sentenceId],
//       }))
//     );

//     gotoNextArticle();
//   };

//   // ======= Reset =======
//   // When the article changes reset the current sentence index and the given feedback
//   useEffect(() => {
//     setCurrentSentenceIdx(
//       article.contents.findIndex((c) => c.htmlType === HtmlType.SPAN)
//     );
//     setFeedback({});
//   }, [article]);

//   // ======= Variables =======
//   const currentSentence =
//     currentSentenceIdx && article.contents[currentSentenceIdx];
//   const totalFeedbackableSentences = React.useMemo(
//     () => article.contents.filter((c) => c.htmlType === HtmlType.SPAN).length,
//     [article]
//   );
//   const feedbackedSentences = Object.keys(feedback).length;

//   return (
//     <FeedbackMechanismWrapper>
//       <div className="basis-3/5">
//         <StudyArticle
//           disableMargin
//           metaData={<ArticleLegend mechanism={FeedbackMechanism.HIGHLIGHTS} />}
//           author={article.author}
//           date={article.date}
//           sentences={article.contents.map((c, idx) => ({
//             ...c,
//             highlighted: true,
//             highlightColor: c.biased
//               ? classNames('bg-highlights-yellow-base')
//               : classNames('bg-highlights-gray-base'),
//             active: idx === currentSentenceIdx,
//             ref: idx === currentSentenceIdx ? currentSentenceRef : undefined,
//             activeColor: classNames({
//               'bg-highlights-yellow-active': c.biased,
//               'bg-highlights-gray-active': !c.biased,
//             }),
//             feedbackIcon: (
//               <FeedbackIcon
//                 userBiased={feedback[c.id]?.biased}
//                 classifierBiased={c.biased || false}
//               />
//             ),
//             onClick: () => {
//               setCurrentSentenceIdx(idx);
//             },
//           }))}
//         />
//       </div>
//       <div className={classNames('flex basis-[25%] flex-col justify-between')}>
//         <div className="flex flex-col gap-3">
//           {currentSentence && currentSentence.biased !== null ? (
//             <CenteredFloatingWrapper
//               topRef={topRef}
//               centerTargetRef={currentSentenceRef}
//               dependencies={[currentSentenceIdx]}
//             >
//               <FeedbackBox>
//                 <SentenceBiasedText biased={currentSentence.biased} />
//                 <FeedbackButtonGroup>
//                   <FeedbackButton
//                     startIcon={<HiCheck size="22px" />}
//                     outlined={
//                       feedback[currentSentence.id]?.biased !==
//                       currentSentence.biased
//                     }
//                     onClick={() =>
//                       storeFeedback(
//                         currentSentence.id,
//                         !!currentSentence.biased
//                       )
//                     }
//                   >
//                     Agree
//                   </FeedbackButton>
//                   <FeedbackButton
//                     startIcon={<HiX size="22px" />}
//                     outlined={
//                       feedback[currentSentence.id] === undefined ||
//                       feedback[currentSentence.id]?.biased ===
//                         currentSentence.biased
//                     }
//                     onClick={() =>
//                       storeFeedback(currentSentence.id, !currentSentence.biased)
//                     }
//                   >
//                     Disagree
//                   </FeedbackButton>
//                 </FeedbackButtonGroup>
//               </FeedbackBox>
//             </CenteredFloatingWrapper>
//           ) : undefined}
//           <FeedbackProgress
//             done={feedbackedSentences}
//             total={totalFeedbackableSentences}
//           />
//         </div>
//         <div>
//           <ConfirmationModal
//             isOpen={confirmationModalOpen}
//             isLastArticle={isLastArticle}
//             close={() => setConfirmationModalOpen(false)}
//             go={submitFeedback}
//           />
//           <FeedbackNextButton
//             onClick={() => {
//               if (feedbackedSentences <= 0) {
//                 return setConfirmationModalOpen(true);
//               }
//               submitFeedback();
//             }}
//             loading={createFeedbackMutation.isLoading}
//             disabled={createFeedbackMutation.isLoading}
//           />
//         </div>
//       </div>
//     </FeedbackMechanismWrapper>
//   );
// }
