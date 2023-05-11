import { Button, Modal } from 'react-daisyui';

type Props = {
  open: boolean;
  close: () => void;
};

export default function InfoModal({ open, close }: Props) {
  return (
    <Modal open={open}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={close}
      >
        ✕
      </Button>
      <Modal.Header>How does the label work?</Modal.Header>
      <Modal.Body className="prose">
        <h2>Quality Criteria</h2>
        <p>
          Our rating consists of the 3 quality criteria listed below and allows
          for easy classification. If an article passes all 3, it receives the
          &quot;reliable&quot; rating. If it passes 2/3, it receives the
          &quot;questionable&quot; ranting. If it passes only 1 or 0, it
          receives the &quot;unreliable&quot; rating.
        </p>
        <h3>Biased Language</h3>
        <p>
          Our{' '}
          <a
            href="https://huggingface.co/mediabiasgroup/DA-RoBERTa-BABE"
            target="_blank"
            rel="noreferrer"
          >
            machine learning classifier
          </a>{' '}
          detects bias on the sentence level. If the total amount of biased
          sentences is under 10%, an article is &quot;low bias&quot; and passes
          the quality criterion. 10%-30% is &quot;medium bias&quot; and over 30%
          is &quot;high bias&quot;, both failing the quality criterion.
        </p>
        <h3>Credible Outlet</h3>
        <p>
          The credibility of an outlet is determined by the rating on the{' '}
          <a
            href="https://adfontesmedia.com/interactive-media-bias-chart/"
            target="_blank"
            rel="noreferrer"
          >
            Ad Fontes Media Bias Chart
          </a>
          . It receives a green hook and passes the quality criteria if it is
          rated as &quot;Most reliable for news&quot; or as &quot;Reliable for
          news but high in analysis/opinion content&quot;.
        </p>
        <h3>Omits Opinion</h3>
        <p>
          We determine if an article omits opinion with the tools provided by{' '}
          <a
            href="https://www.isthiscredible.com/"
            target="_blank"
            rel="noreferrer"
          >
            The Factual
          </a>
          . An article receives only a green hook if The Factual rates it as
          &quot;Generally Neutral&quot;.
        </p>
      </Modal.Body>
    </Modal>
  );
}
