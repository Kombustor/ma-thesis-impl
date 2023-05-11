from typing import List

from lxml import etree
from trafilatura import extract

from .settings import Settings


def get_parsed_xml_and_meta_data(raw_html: str):
    xml = extract(raw_html, output_format="xml")
    if not xml:
        return None, None
    elements = list(etree.fromstring(xml, None).iter())
    root = elements[0]
    meta_data = {
        "title": root.attrib["title"],
        "sitename": root.attrib["sitename"],
        "author": root.attrib["author"],
        "date": root.attrib["date"],
        "source": root.attrib["source"],
    }
    return elements, meta_data


def xml_to_content(title: str, elements: List, settings: Settings):
    content = []
    paragraph_index = 0
    # Skips the root element
    has_heading = False
    for element in elements[1:]:
        text = element.text
        if element.tag == "head":

            is_html_tag_detected = "rend" in element.attrib

            # Use h2 as a fallback, h1 can not be used as it indicates if there is a main heading
            html_type = element.attrib["rend"].upper() if is_html_tag_detected else "H2"

            if html_type == "H1":
                has_heading = True

            content.append(
                {
                    "text": text,
                    "htmlType": html_type,
                    "indexInArticle": len(content),
                    "paragraphIndex": None,
                }
            )
        # one p tag can contain multiple sentences
        elif element.tag == "p":
            doc = settings.sentencizerPipeline(text)
            for span in doc.sents:
                sentence = span.text
                if not sentence.isupper():
                    content.append(
                        {
                            "text": sentence,
                            "htmlType": "SPAN",
                            "indexInArticle": len(content),
                            "paragraphIndex": paragraph_index,
                        }
                    )
            paragraph_index = paragraph_index + 1

    if not has_heading:
        for element in content:
            element["indexInArticle"] = element["indexInArticle"] + 1
        content.insert(
            0,
            {
                "text": title,
                "htmlType": "H1",
                "indexInArticle": 0,
                "paragraphIndex": None,
            },
        )

    return content
