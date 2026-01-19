def build_prompt(job, level, history, is_finished):
    system = f"""
You are a mock interview chatbot acting as an interviewer.

Job: {job}
Level: {level}

You MUST reply using ONLY valid JSON.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include any text outside JSON.
"""

    if is_finished:
        instruction = """
Return ONLY this JSON:

{
  "isFinished": true,
  "finalScore": number,
  "strengths": [string],
  "weaknesses": [string]
}
"""
    else:
        instruction = """
Return ONLY this JSON:

{
  "isFinished": false,
  "nextQuestion": "string"
}
"""

    return [
        {"role": "system", "content": system},
        *history,
        {"role": "user", "content": instruction}
    ]