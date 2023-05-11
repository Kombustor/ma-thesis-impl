from enum import Enum
from typing import List, Union
from xmlrpc.client import boolean

from pydantic import BaseModel


class ContentType(Enum):
    SENTENCE = "s"
    NEW_LINE = "nl"
    HEADING = "h"


class Article(BaseModel):
    rawHtml: str


class ContentToAnalyze(BaseModel):
    id: str
    text: str
    biased: Union[boolean, None] = None


class AnalyzeInput(BaseModel):
    contentsToAnalyze: List[ContentToAnalyze]
