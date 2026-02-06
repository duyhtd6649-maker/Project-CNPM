from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from database.models.cabinets import CvTemplate, InterviewQuestion, Resource
from api.serializers.cabinet_serializers import CvTemplateSerializer, InterviewQuestionSerializer, ResourceSerializer

# --- CV Templates ---
class CvTemplateListCreateView(generics.ListCreateAPIView):
    queryset = CvTemplate.objects.all()
    serializer_class = CvTemplateSerializer
    serializer_class = CvTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(created_by=username, updated_by=username)


class CvTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CvTemplate.objects.all()
    serializer_class = CvTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(updated_by=username)


# --- Interview Questions ---
class InterviewQuestionListCreateView(generics.ListCreateAPIView):
    queryset = InterviewQuestion.objects.all()
    serializer_class = InterviewQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]

    def perform_create(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(created_by=username, updated_by=username)


class InterviewQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InterviewQuestion.objects.all()
    serializer_class = InterviewQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(updated_by=username)


# --- Resources ---
class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(created_by=username, updated_by=username)


class ResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        user = self.request.user
        username = user.username if user and user.is_authenticated else 'system'
        serializer.save(updated_by=username)

