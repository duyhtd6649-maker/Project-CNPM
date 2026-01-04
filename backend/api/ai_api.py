import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from typing import List
import json

current_file_path = Path(__file__).resolve()
project_root = current_file_path.parent.parent.parent
env_path = project_root / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AI Service")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



@app.get("/health")
def health():
    return {"status": "ok"}



class CareerCoachRequest(BaseModel):
    question: str

class CareerCoachResponse(BaseModel):
    expectedCareer: List[str]
    overview: List[str]
    skills: List[str]
    learningPaths: List[str]

@app.post(
    "/ai/career/coach",
    summary = "Career Coach",
    response_model = CareerCoachResponse
)
def career_coach(req: CareerCoachRequest):
    prompt = f"""
    You are a professional career coach.

    Answer the following question with career guidance and skill recommendations.
    
    Return result strictly in JSON with:
- expectedCareer (list)
- overview (list)
- skills (list)
- earningPaths (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

    Question:
    {req.question}
    """
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)




class CvAnalyzerRequest(BaseModel):
    cvText: str
    targetJob: str

class CvAnalyzerResponse(BaseModel):
    overallScore: int
    strengths: List[str]
    missingSkills: List[str]
    recommendation: List[str]

@app.post(
    "/ai/cv/analyzer",
    summary = "CV Analyzer",
    response_model = CvAnalyzerResponse
)
def analyze_cv(req: CvAnalyzerRequest):
    prompt = f"""
You are an AI career coach.

Analyze the following CV for the job: {req.targetJob}

Return result strictly in JSON with:
- overallScore (0-100)
- email (text)
- phone (number)
- education (list)
- previousCompanies (list)
- experience (list)
- existingSkills (list)
- missingSkills (list)
- recommendation (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

CV:
{req.cvText}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)



class JobAnalyzerRequest(BaseModel):
    jobDescription: str

class JobAnalyzerResponse(BaseModel):
    Requirements: List[str]
    SkillsRequired: List[str]
    Major: List[str]

@app.post(
    "/ai/job/analyzer",
    summary = "Job Analyzer",
    response_model = JobAnalyzerResponse
)

def job_analyzer(req: JobAnalyzerRequest):
    prompt = f"""
You are an AI career coach.

Analyze the following description: {req.jobDescription}

Return result strictly in JSON with:
- Requirements (list)
- SkillsRequired (list)
- Major (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

    Description:
    {req.jobDescription}
    """
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)



class JobMatchingRequest(BaseModel):
    input: str

class JobMatchingResponse(BaseModel):
    Skills: List[str]
    Major: List[str]

@app.post(
    "/ai/job/matching",
    summary = "Job Matching",
    response_model = JobMatchingResponse
)

def job_matching(req: JobMatchingRequest):
    prompt = f"""
You are an AI career coach.
Analyze the following candidate information and identify:
- Relevant technical and soft skills
- Suitable majors or job domains

Return result strictly in JSON with:
- Skills (list)
- Major (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

Candidate information:
{req.input}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)


