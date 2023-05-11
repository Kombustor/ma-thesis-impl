from transformers import AutoModelForSequenceClassification, AutoTokenizer

from .settings import Settings


def prepare_models(settings: Settings):
    settings.tokenizer = AutoTokenizer.from_pretrained(settings.tokenizer_path)  # type: ignore
    settings.model = AutoModelForSequenceClassification.from_pretrained(
        settings.model_path
    )

    settings.model.eval()
