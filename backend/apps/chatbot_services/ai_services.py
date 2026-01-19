import os
import json
from openai import OpenAI
from database.models import Conversation, Message
from apps.chatbot_services.llm_client import call_llm
from apps.chatbot_services.prompt_builder import build_prompt

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def career_coach_service(question: str):
    prompt = f"""
You are a professional career coach.

    Answer the following question with career guidance and skill recommendations.
    
    Return result strictly in JSON with:
- expectedCareer (list)
- overview (list)
- skills (list)
- learningPaths (list)

Return ONLY valid JSON. Do not include explanations, text, or markdown.

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
You are an expert AI Recruiter and ATS system. 
Your task is to compare the candidate's CV Content against the Job Description.

Analyze the following CV for the job: {target_job}
CANDIDATE CV CONTENT: {cv_text}

Analyze and return a STRICT JSON object with the following fields:
    - match_percentage (float): 0 to 100 based on keyword matching and experience relevance.
    - summary (string): A short professional summary of the candidate suitability (max 50 words).
    - matching_skills (list of strings): Skills found in CV that match the Job.
    - missing_skills (list of strings): Important skills from Job that are NOT in CV.
    - years_of_experience (float): Total years of relevant experience extracted from CV.
    - pros (list of strings): 3 key strengths.
    - cons (list of strings): 3 key weaknesses or risks.

    IMPORTANT: 
    - Do NOT return Markdown formatting (like ```json). 
    - Return ONLY the raw JSON string.
    - Ignore contact info (email/phone), focus only on skills and experience.
"""
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )
    return json.loads(response.output_text)


def handle_mock_interview(convo: Conversation, user_message: str):
    Message.objects.create(
        conversation=convo,
        role="user",
        content=user_message
    )

    history = [
        {"role": m.role, "content": m.content}
        for m in convo.messages.all()
    ]

    result = call_llm(build_prompt(convo, history))

    if result["isFinished"]:
        convo.is_finished = True
        convo.final_score = result["finalScore"]
        convo.save()
    else:
        Message.objects.create(
            conversation=convo,
            role="assistant",
            content=result["nextQuestion"]
        )

    return result
