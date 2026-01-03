import pdfplumber
import re
import requests
from django.conf import settings

def extract_text_from_cv(file):
    text = ""
    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                text += extracted + '\n'
            return text
    except Exception as e:
        return None
    

