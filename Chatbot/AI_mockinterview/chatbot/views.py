import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Conversation, Message
from .services.interview_engine import handle_turn


@csrf_exempt
def mock_interview_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)

    conversation_id = data.get("conversation_id")

    if conversation_id:
        convo = Conversation.objects.get(id=conversation_id)
    else:
        convo = Conversation.objects.create(
            job=data["job"],
            level=data["level"],
            max_turns = min(data.get("max_turns", 5), 10)
        )

    turn_index = convo.messages.filter(role=Message.Role.USER).count() + 1

    Message.objects.create(
        conversation=convo,
        role=Message.Role.USER,
        content=data["message"],
        turn_index=turn_index
    )

    history = [
        {"role": "user", "content": m.content}
        for m in convo.messages.filter(role=Message.Role.USER)
    ]

    ai_result = handle_turn(convo, history)

    if not ai_result.get("isFinished"):
        Message.objects.create(
            conversation=convo,
            role=Message.Role.ASSISTANT,
            content=ai_result["nextQuestion"],
            turn_index=turn_index
        )
    else:
        convo.is_finished = True
        convo.final_score = ai_result["finalScore"]
        convo.save()

    return JsonResponse({
        "conversation_id": convo.id,
        "result": ai_result
    })
