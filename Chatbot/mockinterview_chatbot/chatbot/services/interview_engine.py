import json
from .llm_client import call_llm
from .prompt_builder import build_prompt

def is_interview_finished(convo):
    user_turns = convo.messages.filter(role="user").count()
    return user_turns >= convo.max_turns


def safe_parse(text):
    try:
        return json.loads(text)
    except Exception as e:
        print("JSON PARSE ERROR:", e)
        return {
            "isFinished": True,
            "finalScore": 0,
            "strengths": [],
            "weaknesses": ["Invalid AI response"]
        }



def handle_turn(convo, history):
    finished = is_interview_finished(convo)

    messages = build_prompt(
        job=convo.job,
        level=convo.level,
        history=history,
        is_finished=finished
    )

    raw = call_llm(messages)
    result = safe_parse(raw)

    return result
