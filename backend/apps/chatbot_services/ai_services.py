import json
from .llm_client import call_llm

def career_coach_service(question: str):
    prompt = f"""
    You are a professional career coach.
    Answer the following question with career guidance and skill recommendations.
    Return result strictly in JSON with: expectedCareer (list), overview (list), skills (list), learningPaths (list).
    
    Question: {question}
    """
    messages = [{"role": "user", "content": prompt}]
    response_text = call_llm(messages)
    return json.loads(response_text)

def cv_analyzer_service(cv_text: str, target_job: str):
    if not cv_text.strip() or not target_job.strip():
        return {"error": "Nội dung CV hoặc vị trí công việc không được để trống"}
    prompt = f"""
    You are an expert AI Recruiter and ATS system. 
    Your task is to compare the candidate's CV Content against the Job Description.

    Analyze the following CV for the job: {target_job}
    CANDIDATE CV CONTENT: {cv_text}

    Analyze and return a STRICT JSON object with the following fields:
    - match_percentage (float): 0 to 100 based on keyword matching and experience relevance.
    - summary (string): A short professional summary of the candidate suitability (max 50 words).
    - matching_skills (list of strings): Skills found in CV that match the Job.
    - missing_skills (list of strings): Important skills from Job that are NOT in CV.
    - skills (list of strings): All skills extracted from CV.
    - years_of_experience (float): Total years of relevant experience extracted from CV.
    - pros (list of strings): 3 key strengths.
    - cons (list of strings): 3 key weaknesses or risks.

    IMPORTANT: 
    - Do NOT return Markdown formatting (like ```json). 
    - Return ONLY the raw JSON string.
    - Ignore contact info (email/phone), focus only on skills and experience.
    """
    messages = [{"role": "user", "content": prompt.strip()}]
    response_text = call_llm(messages)
    return json.loads(response_text)