import fitz
import docx
import pandas as pd
from PIL import Image
import os


def read_file(filepath):

    ext = os.path.splitext(filepath)[1].lower()

    if ext == ".txt":
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    elif ext == ".pdf":
        text = ""
        pdf = fitz.open(filepath)

        for page in pdf:
            text += page.get_text()

        return text

    elif ext == ".docx":
        document = docx.Document(filepath)
        return "\n".join(p.text for p in document.paragraphs)

    elif ext == ".csv":
        df = pd.read_csv(filepath)
        return df.to_string()

    elif ext == ".xlsx":
        df = pd.read_excel(filepath)
        return df.to_string()

    return None