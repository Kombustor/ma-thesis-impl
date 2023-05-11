from typing import Union

from pydantic import BaseSettings
from spacy.lang.en import English
from transformers import AutoModelForSequenceClassification, AutoTokenizer


class Settings(BaseSettings):
    huggingface_repo_slug: str = ""

    tokenizer: Union[AutoTokenizer, None] = None
    tokenizer_path: str = "/models/tokenizer.bin"

    sentencizerPipeline = English()
    sentencizerPipeline.add_pipe("sentencizer")

    model: Union[AutoModelForSequenceClassification, None] = None
    model_path: str = "/models/model.bin"

    prod: Union[str, None] = None
    port: int = 9090

    # pylint: disable=too-few-public-methods
    class Config:
        env_file = ".env"


settings = Settings()
