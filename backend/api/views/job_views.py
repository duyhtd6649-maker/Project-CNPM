from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from apps.job_services import JobService
from ..serializers.job_serializers import JobSerializer,JobForFilterSerializer, JobStatusUpdateSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import *
from drf_yasg import openapi
from database.models.jobs import Jobs, Categories
from database.models.users import Companies


#Dang Job
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={201: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    serializer = JobSerializer(data= request.data)
    if serializer.is_valid():
        try:
            new_job = JobService.create_job(user=request.user, validated_data= serializer.validated_data)
            serializer = JobSerializer(new_job)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)

#Sua, xoa job
@swagger_auto_schema(
    method='put',
    request_body=JobSerializer,
    responses={200: JobSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_job(request, id):
    serializer = JobSerializer(data = request.data)
    if serializer.is_valid():
        try:
            modifield_job = JobService.update_job(user=request.user,validated_data=serializer.validated_data,job_id=id)
            serializer = JobSerializer(modifield_job)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    responses={200: JobSerializer}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, id):
    try:
        modifield_job = JobService.delete_job(user=request.user,job_id=id)
        serializer = JobSerializer(modifield_job)
        return Response(serializer.data, status= status.HTTP_201_CREATED)
    except PermissionDenied:
        return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST) 

#view job
@api_view(['GET'])
def view_job(request):
    jobs = JobService.Get_all_job()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'title',
            openapi.IN_QUERY,
            description="Từ khóa tìm kiếm",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'location',
            openapi.IN_QUERY,
            description="Địa điểm",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'category',
            openapi.IN_QUERY,
            description="Loại công việc",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'description',
            openapi.IN_QUERY,
            description="Mô tả công việc",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'Skill',
            openapi.IN_QUERY,
            description="Kỹ năng yêu cầu",
            type=openapi.TYPE_ARRAY,
            items=openapi.Items(type=openapi.TYPE_STRING), 
            collectionFormat='multi',
            required=False
        ),
        openapi.Parameter(
            'Company',
            openapi.IN_QUERY,
            description="Công ty",
            type=openapi.TYPE_STRING,
            required=False
        ),
    ],
    responses={200: JobSerializer(many=True)}
)
@api_view(['GET'])  # Thử đổi sang GET xem
@permission_classes([IsAuthenticated])
def search_jobs(request):
    try:
        jobs = JobService.search_jobs(filters = request.query_params)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def jobs_of_recruiter(request):
    try:
        filters = JobService.Get_job(user=request.user)
        serializer = JobForFilterSerializer(filters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_jobs(request):
    try:
        jobs = JobService.get_recommended_jobs(user=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    responses={200: JobSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def close_job(request, id):
    try:
        job = JobService.close_job(user=request.user, job_id= id)
        return Response({"detail":"success"}, status=status.HTTP_200_OK)
    except NotFound:
        return Response({"detail":"Job not found"}, status=status.HTTP_404_NOT_FOUND)
    

@swagger_auto_schema(
    method = 'get'
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_job_detail(request, id):
    try:
        job = JobService.view_job_detail(id)
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='put',
    request_body=JobStatusUpdateSerializer,
    responses={200: JobSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def process_job(request, id):
    try:
        serializer = JobStatusUpdateSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        job = JobService.process_job(user=request.user, job_id = id, new_status= serializer.validated_data.get('new_status'))
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({f"{e}"},status=status.HTTP_404_NOT_FOUND)
    except PermissionError as e:
        return Response({f"{e}"},status=status.HTTP_403_FORBIDDEN)


# ===== SEED DATA (CHỈ DÙNG CHO TESTING) =====
@api_view(['GET'])
@permission_classes([AllowAny])
def seed_jobs_data(request):
    """Endpoint tạo dữ liệu giả cho testing - KHÔNG CẦN ĐĂNG NHẬP"""
    try:
        # Tạo Categories
        categories_data = [
            "Information Technology", "Marketing", "Finance & Accounting", 
            "Human Resources", "Design", "Sales", "Engineering", "Customer Service",
        ]
        categories = []
        for name in categories_data:
            cat, _ = Categories.objects.get_or_create(name=name, defaults={'created_by': 'system'})
            categories.append(cat)

        # Tạo Companies
        companies_data = [
            {"name": "TechViet Solutions", "description": "Công ty hàng đầu về phát triển phần mềm tại Việt Nam.", "website": "https://techviet.com.vn", "logo_url": "https://images.unsplash.com/photo-1549924231-f129b911e442?w=200", "address": "123 Nguyễn Huệ, Q1, TP.HCM", "tax_code": "0123456789"},
            {"name": "FPT Software", "description": "FPT Software là công ty CNTT lớn nhất Việt Nam.", "website": "https://fpt-software.com", "logo_url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200", "address": "Duy Tân, Cầu Giấy, Hà Nội", "tax_code": "0101234567"},
            {"name": "VNG Corporation", "description": "VNG sở hữu Zalo, ZaloPay và nhiều sản phẩm gaming.", "website": "https://vng.com.vn", "logo_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200", "address": "182 Lê Đại Hành, Q11, TP.HCM", "tax_code": "0309456712"},
            {"name": "Momo Vietnam", "description": "Ví điện tử MoMo với hơn 40 triệu người dùng.", "website": "https://momo.vn", "logo_url": "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=200", "address": "99 Nguyễn Thị Minh Khai, Q1, TP.HCM", "tax_code": "0312789456"},
            {"name": "Grab Vietnam", "description": "Grab - siêu ứng dụng hàng đầu Đông Nam Á.", "website": "https://grab.com/vn", "logo_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200", "address": "Tòa Lim Tower, Q1, TP.HCM", "tax_code": "0315678901"},
        ]
        companies = []
        for data in companies_data:
            comp, _ = Companies.objects.get_or_create(name=data['name'], defaults={**{k: v for k, v in data.items() if k != 'name'}, 'created_by': 'system'})
            companies.append(comp)

        # Tạo Jobs
        jobs_data = [
            {"title": "Senior Python Developer", "description": "Phát triển backend bằng Python/Django. Yêu cầu 3+ năm kinh nghiệm.", "location": "TP. Hồ Chí Minh", "skill": ["Python", "Django", "PostgreSQL", "Docker", "AWS"], "salary_min": 25000000, "salary_max": 45000000, "status": "active", "company_idx": 0, "category_idx": 0},
            {"title": "Frontend React Developer", "description": "Phát triển UI với React.js. Yêu cầu 2+ năm kinh nghiệm.", "location": "Hà Nội", "skill": ["React", "TypeScript", "Redux", "TailwindCSS"], "salary_min": 18000000, "salary_max": 35000000, "status": "active", "company_idx": 1, "category_idx": 0},
            {"title": "DevOps Engineer", "description": "Xây dựng CI/CD và quản lý AWS/GCP. Yêu cầu 3+ năm.", "location": "TP. Hồ Chí Minh", "skill": ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"], "salary_min": 30000000, "salary_max": 55000000, "status": "active", "company_idx": 2, "category_idx": 0},
            {"title": "Mobile Developer (React Native)", "description": "Phát triển app mobile cross-platform. Yêu cầu 2+ năm.", "location": "Đà Nẵng", "skill": ["React Native", "JavaScript", "iOS", "Android", "Redux"], "salary_min": 20000000, "salary_max": 40000000, "status": "active", "company_idx": 3, "category_idx": 0},
            {"title": "Data Analyst", "description": "Phân tích dữ liệu và xây dựng dashboard. Yêu cầu 2+ năm.", "location": "TP. Hồ Chí Minh", "skill": ["SQL", "Python", "Power BI", "Excel"], "salary_min": 15000000, "salary_max": 28000000, "status": "active", "company_idx": 4, "category_idx": 2},
            {"title": "UI/UX Designer", "description": "Thiết kế giao diện và trải nghiệm người dùng.", "location": "Hà Nội", "skill": ["Figma", "Sketch", "Adobe XD", "Prototyping"], "salary_min": 15000000, "salary_max": 30000000, "status": "active", "company_idx": 0, "category_idx": 4},
            {"title": "Digital Marketing Specialist", "description": "Quản lý chiến dịch Facebook Ads, Google Ads.", "location": "TP. Hồ Chí Minh", "skill": ["Facebook Ads", "Google Ads", "SEO", "Content Marketing"], "salary_min": 12000000, "salary_max": 25000000, "status": "active", "company_idx": 1, "category_idx": 1},
            {"title": "HR Manager", "description": "Quản lý tuyển dụng và chính sách nhân sự.", "location": "Hà Nội", "skill": ["Recruitment", "HR Management", "Training", "Labor Law"], "salary_min": 25000000, "salary_max": 45000000, "status": "active", "company_idx": 2, "category_idx": 3},
            {"title": "Full Stack Developer (Node.js)", "description": "Phát triển full stack với Node.js và React.", "location": "TP. Hồ Chí Minh", "skill": ["Node.js", "React", "MongoDB", "Redis", "Express.js"], "salary_min": 25000000, "salary_max": 50000000, "status": "active", "company_idx": 3, "category_idx": 0},
            {"title": "Product Manager", "description": "Định hướng roadmap và chiến lược sản phẩm.", "location": "TP. Hồ Chí Minh", "skill": ["Product Strategy", "Agile", "Data Analysis", "Jira"], "salary_min": 30000000, "salary_max": 60000000, "status": "active", "company_idx": 4, "category_idx": 0},
        ]
        
        created_jobs = 0
        for data in jobs_data:
            company = companies[data['company_idx']] if companies else None
            category = categories[data['category_idx']] if categories else None
            _, created = Jobs.objects.get_or_create(
                title=data['title'], company=company,
                defaults={'category': category, 'description': data['description'], 'location': data['location'], 'skill': data['skill'], 'salary_min': data['salary_min'], 'salary_max': data['salary_max'], 'status': data['status'], 'created_by': 'system'}
            )
            if created:
                created_jobs += 1

        return Response({
            "status": "success",
            "message": f"Đã tạo dữ liệu thành công!",
            "data": {
                "categories": len(categories),
                "companies": len(companies),
                "jobs_created": created_jobs,
                "total_jobs": Jobs.objects.count()
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
