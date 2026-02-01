def build_prompt(job, level, history, is_finished):
    system = f"""
    You are a mock interview chatbot acting as an interviewer for the position: {job} (Level: {level}).
    You must only respond in JSON format.
    """

    if is_finished:
        instruction = """
        The interview is over. Provide a final evaluation in this JSON format:
        {
          "isFinished": true,
          "finalScore": number (0-100),
          "strengths": [string],
          "weaknesses": [string]
        }
        """
    else:
        instruction = """
        Continue the interview. Provide the next question in this JSON format:
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