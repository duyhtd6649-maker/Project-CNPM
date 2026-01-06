# chatbot/services.py
import json
from openai import OpenAI

client = OpenAI()

def mock_interview_reply(job, level, max_turns, history):
    user_turns = len([m for m in history if m["role"] == "user"])

    prompt = f"""
You are a mock interview chatbot.

Job: {job}
Level: {level}

Rules:
- Maximum questions: {max_turns}
- Ask ONE question per turn
- When user_turns == {max_turns}, stop and evaluate

Conversation history:
{json.dumps(history, indent=2)}

Return ONLY valid JSON.

If not finished:
{{
  "isFinished": false,
  "nextQuestion": "string"
}}

If finished:
{{
  "isFinished": true,
  "finalScore": number,
  "strengths": [string],
  "weaknesses": [string]
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return json.loads(response.output_text)
