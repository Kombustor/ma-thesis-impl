import uvicorn
from fastapi import FastAPI, HTTPException

from .inference import classify_text
from .models import AnalyzeInput, Article
from .parse_article import get_parsed_xml_and_meta_data, xml_to_content
from .settings import settings
from .utils import prepare_models

prepare_models(settings)

app = FastAPI()


@app.post("/raw-html-to-content")
async def raw_html_to_content(article: Article):
    elements, meta_data = get_parsed_xml_and_meta_data(article.rawHtml)
    if not elements or not meta_data:
        raise HTTPException(status_code=400, detail="Could not parse raw HTML.")
    return meta_data | {
        "contents": xml_to_content(meta_data["title"], elements, settings)
    }


@app.post("/analyze")
async def analyze(analyze_input: AnalyzeInput):
    return classify_text(analyze_input.contentsToAnalyze)


@app.get("/health", status_code=200)
async def health():
    pass


def start():
    uvicorn.run(
        "src.inference.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=not settings.prod,
    )
