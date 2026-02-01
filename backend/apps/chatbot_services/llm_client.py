import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_llm(messages):
    valid_contents = []
    system_instruction = ""

    for m in messages:
        content_text = m.get('content', '').strip()
        
        if m.get('role') == 'system':
            system_instruction = content_text
            continue
        if content_text:
            role = 'user' if m['role'] == 'user' else 'model'
            valid_contents.append({
                "role": role, 
                "parts": [content_text] 
            })


    if not valid_contents:
        raise ValueError("Invalid input: All message contents are empty after processing.")

    model = genai.GenerativeModel(
        model_name='models/gemini-2.0-flash',
        system_instruction=system_instruction if system_instruction else None
    )

    response = model.generate_content(
        valid_contents,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.3
        )
    )
    
    return response.text