from openai import NotFoundError
import pdfplumber
import re
import requests
import hashlib
from django.conf import settings
from django.db import transaction
from database.models.CV import Cvs,Cvanalysisresult
from database.models.users import Candidates, Users
from .chatbot_services.ai_services import cv_analyzer_service
from rest_framework.exceptions import *

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
    text = re.sub(r'[\n\t\r]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_format_local(text, page_count):
    score = 100
    issues = []
    
    word_count = len(text.split())

    if word_count < 150:
        score -= 20
        issues.append("CV quá ngắn (<150 từ). Hãy bổ sung thêm chi tiết.")
    elif word_count > 2000:
        score -= 10
        issues.append("CV quá dài (>2000 từ). Hãy tóm tắt lại.")

    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
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

def save_analysis_result(user, cv_file, ai_result, format_result, target_job, cv_instance):
    try:
        with transaction.atomic():
            try:
                candidate_profile = Candidates.objects.get(user=user)
            except Candidates.DoesNotExist:
                raise ValueError(f"User {user.username} chưa có hồ sơ Candidate (Profile).")
            cv_file.seek(0)
            analysis_instance = Cvanalysisresult.objects.create(
                cv=cv_instance,
                target_job=target_job,
                
                content_score=ai_result.get('match_percentage', 0),
                format_score=format_result['format_score'],
                
                extracted_email=format_result.get('extracted_email'),
                extracted_phone=format_result.get('extracted_phone'),
                
                ai_response_json=ai_result,
                format_analysis_json=format_result,

                extracted_skill = ai_result.get("skills", [])
            )
            
            return analysis_instance

    except Exception as e:
        raise e 
    
def analyze_cv(validated_data, user):
    upload_file = validated_data['file_url']
    target_job = validated_data['targetjob']
    scanned_text = extract_text_from_cv(upload_file)

    if not scanned_text or not scanned_text['raw_text']:
        raise Exception
    
    cv_text_clean = scanned_text['raw_text']
    page_count = scanned_text['page_count']
    format_analysis = analyze_format_local(cv_text_clean, page_count)

    try:
        ai_data = cv_analyzer_service(cv_text=cv_text_clean,target_job=target_job)
    except requests.exceptions.ConnectionError:
        raise ConnectionError({"error":"Can't connect to AI server"})
    except requests.exceptions.Timeout:
        raise TimeoutError({"error":"Timeout"})
    except requests.exceptions.RequestException as e:
        raise Exception({"error": f"Error from AI Server: {str(e)}"})
    try:
        cv_instance = upload_cv(user=user, validated_data=validated_data)
        saved_result = save_analysis_result(
            user=user,
            cv_file=upload_file,
            ai_result=ai_data,
            format_result=format_analysis,
            target_job = target_job,
            cv_instance=cv_instance,
        )
    except Exception as e:
        raise Exception({"error": f"Failed to save analysis result to database: {str(e)}"})
    
    final_response = {
        "status": "success",
        "result_id": saved_result.id,
        "overall_score": saved_result.overall_score,

        "overview": {
            "file_name": upload_file.name,
            "page_count": page_count,
            "word_count": format_analysis['word_count']
        },
        "format_analysis": {
            "score": format_analysis['format_score'],
            "issues": format_analysis['contact_issues']
        },
        "content_analysis": ai_data 
    }
    
    return final_response

def upload_cv(user, validated_data):
    upload_file = validated_data['file_url']
    try:
        candidate_profile = Candidates.objects.get(user=user)
        file_hash = hash_file(upload_file)
        existing_cv = Cvs.objects.filter(candidate=candidate_profile, file_hash=file_hash).first()
        if existing_cv:
            return existing_cv
    except Candidates.DoesNotExist:
        raise ValueError(f"User {user.username} chưa có hồ sơ Candidate (Profile).")
    cv_instance = Cvs.objects.create(
        candidate=candidate_profile,
        file_name=upload_file.name,
        file_url=upload_file,
        file_hash = file_hash,
        created_by=user.username
    )
    return cv_instance

def hash_file(file):
    hasher = hashlib.sha256()
    for chunk in file.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


def cv_detail(cv_id):
    try:
        return Cvs.objects.get(id = cv_id, isdeleted = False)
    except Cvs.DoesNotExist:
        raise NotFound({"error":"Cv not found"})
    
def cv_list(user):
    try:
        candidate = Candidates.objects.get(user = user, isdeleted = False)
        cv = Cvs.objects.filter(candidate = candidate, isdeleted = False)
        return cv
    except Candidates.DoesNotExist:
        raise PermissionError({"error":"User not a Candidate"})
    
def analysis_detail(analysis_id):
    try:
        detail = Cvanalysisresult.objects.get(id = analysis_id, isdeleted = False)
        final_response = {
            "status": "success",
            "result_id": analysis_id,
            "overall_score": detail.overall_score,

            "overview": {
                "file_name": detail.cv.file_name,
                "page_count": detail.format_analysis_json.get('page_count',0),
                "word_count": detail.format_analysis_json.get('word_count',0)
            },
            "format_analysis": {
                "score": detail.format_analysis_json.get('format_score',0),
                "issues": detail.format_analysis_json.get('contact_issues',[])
            },
            "content_analysis": detail.ai_response_json
        }
        return final_response
    except Cvanalysisresult.DoesNotExist:
        raise NotFound({"error":"Analysis not found"})
    except Exception as e:
        raise Exception({f"{e}"})
    
def analysis_list(user ,cv_id):
    try:
        candidate = Candidates.objects.get(user = user, isdeleted = False)
    except Candidates.DoesNotExist:
        raise PermissionError({"error":"User not a Candidate"})
    if Cvs.objects.get(candidate = candidate, id = cv_id):
        cv = Cvanalysisresult.objects.filter(cv_id = cv_id, isdeleted = False)
        return cv
    raise PermissionError({"error":"User don't have permission"})

    

