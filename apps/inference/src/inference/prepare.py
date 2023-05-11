from transformers import AutoModelForSequenceClassification, AutoTokenizer

from .settings import settings


def prepare():
    model_repo = settings.huggingface_repo_slug

    print("Downloading model from HuggingFace: " + model_repo)

    tokenizer = AutoTokenizer.from_pretrained(model_repo, use_fast=True)
    model = AutoModelForSequenceClassification.from_pretrained(model_repo)

    tokenizer.save_pretrained(settings.tokenizer_path)
    model.save_pretrained(settings.model_path)
