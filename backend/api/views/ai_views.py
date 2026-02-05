from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..serializers.ai_serializers import CareerCoachRequestSerializer,CareerCoachResponseSerializer, CvAnalyzerRequestSerializer
from apps.chatbot_services.ai_services import career_coach_service, cv_analyzer_service
from rest_framework.decorators import api_view
from database.models import Conversation, Message
from apps.chatbot_services.interview_engine import handle_turn
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import json


class CareerCoachAPIView(APIView):
    @swagger_auto_schema(
        operation_description="AI Career Coach - Tư vấn lộ trình nghề nghiệp",
        request_body=CareerCoachRequestSerializer,
        responses={
            200: CareerCoachResponseSerializer,
            400: "Bad Request - Thiếu câu hỏi hoặc dữ liệu sai format"
        }
    )
    def post(self, request):
        req_serializer = CareerCoachRequestSerializer(data=request.data)
        req_serializer.is_valid(raise_exception=True)

        try:
            ai_result = career_coach_service(
                req_serializer.validated_data["question"]
            )
            res_serializer = CareerCoachResponseSerializer(data=ai_result)
            
            if res_serializer.is_valid():
                return Response(res_serializer.data, status=status.HTTP_200_OK)
            else:
                print("AI Output Error:", res_serializer.errors)
                return Response(
                    {
                        "error": "AI trả về dữ liệu thiếu hoặc sai định dạng.", 
                        "details": res_serializer.errors
                    }, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except json.JSONDecodeError:
            return Response(
                {"error": "AI trả về định dạng text thay vì JSON. Vui lòng thử lại."}, 
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            return Response(
                {"error": f"Lỗi hệ thống: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class CvAnalyzerAPIView(APIView):
    def post(self, request):
        serializer = CvAnalyzerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = cv_analyzer_service(
            serializer.validated_data["cvText"],
            serializer.validated_data["targetJob"]
        )

        return Response(result, status=status.HTTP_200_OK)


@api_view(["POST"])
def mock_interview(request):
    data = request.data

    conversation_id = data.get("conversation_id")

    if conversation_id:
        convo = Conversation.objects.get(id=conversation_id)
    else:
        convo = Conversation.objects.create(
            job=data["job"],
            level=data["level"],
            max_turns=min(data.get("max_turns", 5), 10)
        )

    turn_index = convo.messages.filter(role="user").count() + 1

    Message.objects.create(
        conversation=convo,
        role="user",
        content=data["message"],
        turn_index=turn_index
    )

    history = [
        {"role": m.role, "content": m.content}
        for m in convo.messages.order_by("created_at")
    ]

    ai_result = handle_turn(convo, history)

    if not ai_result.get("isFinished"):
        Message.objects.create(
            conversation=convo,
            role="assistant",
            content=ai_result["nextQuestion"],
            turn_index=turn_index
        )
    else:
        convo.is_finished = True
        convo.final_score = ai_result["finalScore"]
        convo.save()

    return Response(
        {
            "conversation_id": convo.id,
            "result": ai_result
        },
        status=status.HTTP_200_OK
    )