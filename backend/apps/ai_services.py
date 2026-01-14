import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def career_coach_service(question: str):
    prompt = f"""
You are a professional career coach.

Return strictly JSON with:
- expectedCareer
- overview
- skills
- learningPaths

Question:
{question}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)


def cv_analyzer_service(cv_text: str, target_job: str):
    prompt = f"""
You are an expert AI Recruiter.

CV: {cv_text}
Target job: {target_job}

Return STRICT JSON with:
- match_percentage
- summary
- matching_skills
- missing_skills
- years_of_experience
- pros
- cons
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)
