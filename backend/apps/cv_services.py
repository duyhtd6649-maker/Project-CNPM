import pdfplumber
import re
import requests
from django.conf import settings

def extract_text_from_cv(file):
    text = ""
    page_count = 0
    try:
        with pdfplumber.open(file) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + ' ' 
        
        cleaned_text = clean_text(text)
        return {
            "raw_text": cleaned_text,
            "page_count": page_count
        }
    except Exception as e:
        return None
    
def clean_text(text):
    if not text:
        return ""
    # Thay thế nhiều dấu xuống dòng, tab thành 1 dấu cách
    text = re.sub(r'[\n\t\r]+', ' ', text)
    # Thay thế nhiều khoảng trắng thành 1 khoảng trắng
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_format_local(text, page_count):
    score = 100
    issues = []
    
    word_count = len(text.split())

    # 1. Kiểm tra độ dài (ATS thường thích 200 - 2000 từ)
    if word_count < 150:
        score -= 20
        issues.append("CV quá ngắn (<150 từ). Hãy bổ sung thêm chi tiết.")
    elif word_count > 2000:
        score -= 10
        issues.append("CV quá dài (>2000 từ). Hãy tóm tắt lại.")

    # Regex tìm email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    # Regex tìm số điện thoại (VN format cơ bản)
    phone_pattern = r'(0|\+84)[0-9\s.-]{9,13}'
    
    has_email = re.search(email_pattern, text)
    has_phone = re.search(phone_pattern, text)

    if not has_email:
        score -= 30 
        issues.append("Không tìm thấy Email liên hệ.")
    
    if not has_phone:
        score -= 20
        issues.append("Không tìm thấy Số điện thoại.")

    return {
        "format_score": max(0, score),
        "page_count": page_count,
        "word_count": word_count,
        "contact_issues": issues,
        "has_contact_info": bool(has_email and has_phone)
    }

