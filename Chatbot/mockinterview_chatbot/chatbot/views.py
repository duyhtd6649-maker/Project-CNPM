# chatbot/views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Conversation, Message
from .services import mock_interview_reply

@csrf_exempt
def mock_interview_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)

    conversation_id = data.get("conversation_id")
    message_text = data.get("message")

    if not conversation_id:
        convo = Conversation.objects.create(
            job=data["job"],
            level=data["level"],
            max_turns=data.get("max_turns", 5)
        )
    else:
        convo = Conversation.objects.get(id=conversation_id)

    Message.objects.create(
        conversation=convo,
        role="user",
        content=message_text
    )

    history = [
        {"role": m.role, "content": m.content}
        for m in convo.messages.order_by("created_at")
    ]


    ai_result = mock_interview_reply(
        job=convo.job,
        level=convo.level,
        max_turns=convo.max_turns,
        history=history
    )
    
    if not ai_result["isFinished"]:
        Message.objects.create(
            conversation=convo,
            role="assistant",
            content=ai_result["nextQuestion"]
        )
    else:
        convo.is_finished = True
        convo.final_score = ai_result["finalScore"]
        convo.save()

    return JsonResponse({
        "conversation_id": convo.id,
        "result": ai_result
    })
