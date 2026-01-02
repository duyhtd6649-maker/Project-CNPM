from dotenv import load_dotenv
load_dotenv(override=True)
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from typing import List
from typing import Optional, Dict
import json

app = FastAPI(title="AI Service")

client = OpenAI()

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
    summary = "Career Coach"
)
def career_coach(req: CareerCoachRequest):
    jobInfo = f"for the job: {req.targetJob}" if req.targetJob else "general career suitability"
    prompt = f"""
    You are a professional career coach.

    Analyze the following CV for the job: {jobInfo}.
    
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
    return {
        "result": json.loads(response.output_text)
    }



class CvAnalyzerRequest(BaseModel):
    sections: Dict[str, str]
    targetJob: Optional[str] = None

class CvAnalyzerResponse(BaseModel):
    overallScore: int
    strengths: List[str]
    missingSkills: List[str]
    recommendation: List[str]

def merge_section(sections: dict) -> str:
    merged = []
    for k, v in sections.items():
        merged.append(f"{k.upper()}:\n{v}")
    return "\n\n".join(merged)

@app.post(
    "/ai/cv/analyzer",
    summary = "CV Analyzer"
)
def analyze_cv(req: CvAnalyzerRequest):
    cv_text = merge_section(req.sections)
    job_infor = f"For the job {req.targetJob}" if req.targetJob else "for general career suitability"
    prompt = f"""
You are an AI career coach.

Analyze the following CV for the job: {job_infor}

Return result strictly in JSON with:
- overallScore (0-100)
- strengths (list)
- missingSkills (list)
- recommendation (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

CV:
{cv_text}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return {
        "result": json.loads(response.output_text)
    }


class MockInterviewRequest(BaseModel):
    text: str

@app.post("/ai/mock-interview", summary="Mock Interview")
def mock_interview(req: MockInterviewRequest):
    prompt = f"""
You are a professional technical interviewer.

The following text is a candidate's answer or explanation during a mock interview.

Tasks:
- Infer the technical domain and approximate level from the text.
- Evaluate the quality and correctness of the answer.
- Give constructive feedback.
- Provide a score from 0 to 10.
- Suggest improvement tips.
- Ask ONE follow-up interview question.

Return ONLY valid JSON with:
- inferredDomain
- inferredLevel
- feedback
- score
- improvementTips
- followUpQuestion

Do not include explanations, markdown, or extra text.

Candidate text:
{req.text}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return {
        "result": json.loads(response.output_text)
    }


   




