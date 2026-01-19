from openai import OpenAI

client = OpenAI()

def call_llm(messages):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        temperature=0.3
    )
    return response.choices[0].message.content