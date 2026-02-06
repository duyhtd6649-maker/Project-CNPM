from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from database.models.users import Users
from database.models.jobs import Jobs
from database.models.cabinets import InterviewQuestion, Resource, CvTemplate
from datetime import datetime, timedelta

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # 1. Overview Counts
        total_users = Users.objects.filter(isdeleted=False).count()
        total_questions = InterviewQuestion.objects.filter(isdeleted=False).count()
        
        # Total Files = Resources + CvTemplates
        total_resources = Resource.objects.filter(isdeleted=False).count()
        total_templates = CvTemplate.objects.filter(isdeleted=False).count()
        total_files = total_resources + total_templates
        
        total_jobs = Jobs.objects.filter(isdeleted=False).count()

        # 2. Registration Analytics (Last 12 months)
        # Group by month and count
        last_year = datetime.now() - timedelta(days=365)
        registrations = Users.objects.filter(created_date__gte=last_year) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')
        
        registration_data = []
        for reg in registrations:
            if reg['month']:
                registration_data.append({
                    'name': reg['month'].strftime('%b %Y'),
                    'value': reg['count']
                })

        # 3. User Segments
        recruiters_count = Users.objects.filter(role='recruiter', isdeleted=False).count()
        candidates_count = Users.objects.filter(role='candidate', isdeleted=False).count()

        # 4. Job Post Analytics (Platform Growth - using Jobs created)
        jobs_analytics = Jobs.objects.filter(created_date__gte=last_year) \
            .annotate(month=TruncMonth('created_date')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

        job_growth_data = []
        for job in jobs_analytics:
            if job['month']:
                job_growth_data.append({
                    'year': job['month'].strftime('%b %Y'),
                    'jobs': job['count']
                })

        data = {
            'overview': {
                'total_users': total_users,
                'total_questions': total_questions,
                'total_files': total_files,
                'total_jobs': total_jobs
            },
            'registration_analytics': registration_data,
            'user_segments': {
                'recruiters': recruiters_count,
                'candidates': candidates_count,
                'total': recruiters_count + candidates_count 
            },
            'job_growth': job_growth_data
        }

        return Response(data)
