from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from typing import List

app = FastAPI(title="AI Service")

client = OpenAI()

@app.get("/health")
def health():
    return {"status": "ok"}

class Question(BaseModel):
    question: str

@app.post("/ai/career/coach")
def career_coach(req: Question):
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=req.question
    )
    return {"answer": response.output_text}


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
    summary = "CV Analyzer"
)
def analyze_cv(req: CvAnalyzerRequest):
    prompt = f"""
You are an AI career coach.

Analyze the following CV for the job: {req.targetJob}

Return result strictly in JSON with:
- overallScore (0-100)
- strengths (list)
- missingSkills (list)
- recommendation (list)

CV:
{req.cvText}
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return {
        "resutl": response.output_text
    }






