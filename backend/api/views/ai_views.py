from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..serializers.ai_serializers import CareerCoachRequestSerializer,CareerCoachResponseSerializer, CvAnalyzerRequestSerializer
from apps.ai_services import career_coach_service, cv_analyzer_service


class CareerCoachAPIView(APIView):
    def post(self, request):
        serializer = CareerCoachRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = career_coach_service(
            serializer.validated_data["question"]
        )

        return Response(result, status=status.HTTP_200_OK)


class CvAnalyzerAPIView(APIView):
    def post(self, request):
        serializer = CvAnalyzerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = cv_analyzer_service(
            serializer.validated_data["cvText"],
            serializer.validated_data["targetJob"]
        )

        return Response(result, status=status.HTTP_200_OK)