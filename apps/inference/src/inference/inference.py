import sys
from typing import List

import torch
import torch.nn.functional as F

from .models import ContentToAnalyze
from .settings import settings


# pylint: disable=not-callable
def classify_sentences(sentences: List[str]):
    if not settings.tokenizer or not settings.model:
        sys.exit("No model or tokenizer was loaded")

    toksentences = settings.tokenizer(
        sentences, truncation=True, padding=True, return_tensors="pt"
    )  # type: ignore[reportOptionalCall]
    if settings.model:
        settings.model.eval()  # type: ignore[reportGeneralTypeIssues]
    with torch.no_grad():
        toksentences.to(torch.device("cpu"))
        output = settings.model(**toksentences)  # type: ignore[reportOptionalCall]

    return F.softmax(output.logits, dim=1).argmax(dim=1)


def classify_text(contents_to_analyze: List[ContentToAnalyze]):
    annotations = classify_sentences(list(map(lambda x: x.text, contents_to_analyze)))

    # Add classification results to content list
    for content, annotation in zip(contents_to_analyze, annotations):
        content.biased = not annotation == 0
        del content.text

    return contents_to_analyze
