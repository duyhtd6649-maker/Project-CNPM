"""
Django Management Command để tạo dữ liệu giả cho Jobs
Chạy: python manage.py seed_jobs
"""
from django.core.management.base import BaseCommand
from database.models.jobs import Jobs, Categories
from database.models.users import Companies


class Command(BaseCommand):
    help = 'Tạo dữ liệu mẫu cho Categories, Companies và Jobs'

    def create_categories(self):
        """Tạo các danh mục công việc"""
        categories_data = [
            "Information Technology",
            "Marketing",
            "Finance & Accounting", 
            "Human Resources",
            "Design",
            "Sales",
            "Engineering",
            "Customer Service",
        ]
        
        created_categories = []
        for name in categories_data:
            category, created = Categories.objects.get_or_create(
                name=name,
                defaults={'created_by': 'system'}
            )
            created_categories.append(category)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Created category: {name}"))
            else:
                self.stdout.write(f"• Category exists: {name}")
        
        return created_categories

    def create_companies(self):
        """Tạo các công ty mẫu"""
        companies_data = [
            {
                "name": "TechViet Solutions",
                "description": "Công ty hàng đầu về phát triển phần mềm và giải pháp công nghệ tại Việt Nam. Chúng tôi chuyên về Web, Mobile và Cloud Solutions.",
                "website": "https://techviet.com.vn",
                "logo_url": "https://images.unsplash.com/photo-1549924231-f129b911e442?w=200",
                "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
                "tax_code": "0123456789"
            },
            {
                "name": "FPT Software",
                "description": "FPT Software là công ty công nghệ thông tin lớn nhất Việt Nam, cung cấp dịch vụ outsourcing và giải pháp CNTT toàn cầu.",
                "website": "https://fpt-software.com",
                "logo_url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
                "address": "Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội",
                "tax_code": "0101234567"
            },
            {
                "name": "VNG Corporation",
                "description": "VNG là công ty công nghệ hàng đầu Việt Nam, sở hữu Zalo, ZaloPay và nhiều sản phẩm gaming nổi tiếng.",
                "website": "https://vng.com.vn",
                "logo_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200",
                "address": "182 Lê Đại Hành, Quận 11, TP.HCM",
                "tax_code": "0309456712"
            },
            {
                "name": "Momo Vietnam",
                "description": "Ví điện tử MoMo - Siêu ứng dụng thanh toán và tài chính hàng đầu Việt Nam với hơn 40 triệu người dùng.",
                "website": "https://momo.vn",
                "logo_url": "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=200",
                "address": "99 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
                "tax_code": "0312789456"
            },
            {
                "name": "Grab Vietnam",
                "description": "Grab là siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ gọi xe, giao đồ ăn và thanh toán điện tử.",
                "website": "https://grab.com/vn",
                "logo_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200",
                "address": "Tòa nhà Lim Tower, 9-11 Tôn Đức Thắng, Quận 1, TP.HCM",
                "tax_code": "0315678901"
            },
        ]
        
        created_companies = []
        for data in companies_data:
            company, created = Companies.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'website': data['website'],
                    'logo_url': data['logo_url'],
                    'address': data['address'],
                    'tax_code': data['tax_code'],
                    'created_by': 'system'
                }
            )
            created_companies.append(company)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Created company: {data['name']}"))
            else:
                self.stdout.write(f"• Company exists: {data['name']}")
        
        return created_companies

    def create_jobs(self, companies, categories):
        """Tạo các job mẫu"""
        jobs_data = [
            {
                "title": "Senior Python Developer",
                "description": """Mô tả công việc:
- Phát triển và bảo trì các ứng dụng backend bằng Python/Django
- Thiết kế và tối ưu hóa cơ sở dữ liệu PostgreSQL
- Làm việc với Docker, Kubernetes và AWS
- Code review và mentor junior developers

Yêu cầu:
- 3+ năm kinh nghiệm với Python
- Thành thạo Django/FastAPI
- Kinh nghiệm với REST API và microservices
- Tiếng Anh giao tiếp tốt""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["Python", "Django", "PostgreSQL", "Docker", "AWS", "REST API"],
                "salary_min": 25000000,
                "salary_max": 45000000,
                "status": "active",
                "company_idx": 0,
                "category_idx": 0
            },
            {
                "title": "Frontend React Developer",
                "description": """Mô tả công việc:
- Phát triển giao diện người dùng với React.js
- Làm việc với Redux, TypeScript và TailwindCSS
- Tích hợp API và tối ưu hiệu năng

Yêu cầu:
- 2+ năm kinh nghiệm với React
- Thành thạo JavaScript/TypeScript
- Hiểu biết về UX/UI design""",
                "location": "Hà Nội",
                "skill": ["React", "TypeScript", "Redux", "TailwindCSS", "JavaScript", "Git"],
                "salary_min": 18000000,
                "salary_max": 35000000,
                "status": "active",
                "company_idx": 1,
                "category_idx": 0
            },
            {
                "title": "DevOps Engineer",
                "description": """Mô tả công việc:
- Xây dựng và duy trì CI/CD pipelines
- Quản lý infrastructure trên AWS/GCP
- Monitoring và alerting với Prometheus/Grafana
- Container orchestration với Kubernetes

Yêu cầu:
- 3+ năm kinh nghiệm DevOps
- Thành thạo Linux và scripting
- Kinh nghiệm với Docker và Kubernetes""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"],
                "salary_min": 30000000,
                "salary_max": 55000000,
                "status": "active",
                "company_idx": 2,
                "category_idx": 0
            },
            {
                "title": "Mobile Developer (React Native)",
                "description": """Mô tả công việc:
- Phát triển ứng dụng mobile cross-platform
- Tích hợp native modules khi cần thiết
- Tối ưu performance và UX

Yêu cầu:
- 2+ năm kinh nghiệm React Native
- Có kiến thức về iOS/Android native
- Kinh nghiệm với Redux/MobX""",
                "location": "Đà Nẵng",
                "skill": ["React Native", "JavaScript", "iOS", "Android", "Redux", "Firebase"],
                "salary_min": 20000000,
                "salary_max": 40000000,
                "status": "active",
                "company_idx": 3,
                "category_idx": 0
            },
            {
                "title": "Data Analyst",
                "description": """Mô tả công việc:
- Phân tích dữ liệu kinh doanh và user behavior
- Xây dựng dashboard và báo cáo với Power BI
- Làm việc với SQL và Python

Yêu cầu:
- 2+ năm kinh nghiệm Data Analysis
- Thành thạo SQL và Excel
- Kinh nghiệm với Power BI hoặc Tableau""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["SQL", "Python", "Power BI", "Excel", "Data Visualization", "Statistics"],
                "salary_min": 15000000,
                "salary_max": 28000000,
                "status": "active",
                "company_idx": 4,
                "category_idx": 2
            },
            {
                "title": "UI/UX Designer",
                "description": """Mô tả công việc:
- Thiết kế giao diện và trải nghiệm người dùng
- Tạo wireframes, mockups và prototypes
- Thực hiện user research và usability testing

Yêu cầu:
- 2+ năm kinh nghiệm UI/UX Design
- Thành thạo Figma hoặc Sketch
- Portfolio ấn tượng là bắt buộc""",
                "location": "Hà Nội",
                "skill": ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
                "salary_min": 15000000,
                "salary_max": 30000000,
                "status": "active",
                "company_idx": 0,
                "category_idx": 4
            },
            {
                "title": "Digital Marketing Specialist",
                "description": """Mô tả công việc:
- Lên kế hoạch và thực hiện chiến dịch digital marketing
- Quản lý quảng cáo Facebook, Google Ads
- SEO và content marketing

Yêu cầu:
- 2+ năm kinh nghiệm Digital Marketing
- Thành thạo Facebook Ads và Google Ads
- Kiến thức SEO và Content Marketing""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["Facebook Ads", "Google Ads", "SEO", "Content Marketing", "Google Analytics", "Social Media"],
                "salary_min": 12000000,
                "salary_max": 25000000,
                "status": "active",
                "company_idx": 1,
                "category_idx": 1
            },
            {
                "title": "HR Manager",
                "description": """Mô tả công việc:
- Quản lý toàn bộ quy trình tuyển dụng
- Xây dựng chính sách nhân sự và văn hóa công ty
- Đào tạo và phát triển nhân viên

Yêu cầu:
- 5+ năm kinh nghiệm HR
- 2+ năm ở vị trí quản lý
- Kỹ năng lãnh đạo và giao tiếp xuất sắc""",
                "location": "Hà Nội",
                "skill": ["Recruitment", "HR Management", "Training", "Labor Law", "Employee Relations", "HRIS"],
                "salary_min": 25000000,
                "salary_max": 45000000,
                "status": "active",
                "company_idx": 2,
                "category_idx": 3
            },
            {
                "title": "Full Stack Developer (Node.js)",
                "description": """Mô tả công việc:
- Phát triển full stack với Node.js và React
- Thiết kế và triển khai RESTful APIs
- Làm việc với MongoDB và Redis

Yêu cầu:
- 3+ năm kinh nghiệm Full Stack
- Thành thạo Node.js và React
- Kinh nghiệm với NoSQL databases""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["Node.js", "React", "MongoDB", "Redis", "Express.js", "TypeScript"],
                "salary_min": 25000000,
                "salary_max": 50000000,
                "status": "active",
                "company_idx": 3,
                "category_idx": 0
            },
            {
                "title": "Product Manager",
                "description": """Mô tả công việc:
- Định hướng roadmap và chiến lược sản phẩm
- Thu thập requirements và viết PRD
- Làm việc với UX, Engineering và Business

Yêu cầu:
- 3+ năm kinh nghiệm Product Management
- Background kỹ thuật hoặc MBA
- Kinh nghiệm với Agile/Scrum""",
                "location": "TP. Hồ Chí Minh",
                "skill": ["Product Strategy", "Agile", "Data Analysis", "Stakeholder Management", "Jira", "User Stories"],
                "salary_min": 30000000,
                "salary_max": 60000000,
                "status": "active",
                "company_idx": 4,
                "category_idx": 0
            },
        ]
        
        created_jobs = []
        for data in jobs_data:
            company = companies[data['company_idx']] if companies else None
            category = categories[data['category_idx']] if categories else None
            
            job, created = Jobs.objects.get_or_create(
                title=data['title'],
                company=company,
                defaults={
                    'category': category,
                    'description': data['description'],
                    'location': data['location'],
                    'skill': data['skill'],
                    'salary_min': data['salary_min'],
                    'salary_max': data['salary_max'],
                    'status': data['status'],
                    'created_by': 'system'
                }
            )
            created_jobs.append(job)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✓ Created job: {data['title']}"))
            else:
                self.stdout.write(f"• Job exists: {data['title']}")
        
        return created_jobs

    def handle(self, *args, **options):
        self.stdout.write("\n" + "="*50)
        self.stdout.write(self.style.HTTP_INFO("🚀 BẮT ĐẦU TẠO DỮ LIỆU MẪU"))
        self.stdout.write("="*50 + "\n")
        
        self.stdout.write(self.style.WARNING("📁 Tạo Categories..."))
        categories = self.create_categories()
        self.stdout.write("")
        
        self.stdout.write(self.style.WARNING("🏢 Tạo Companies..."))
        companies = self.create_companies()
        self.stdout.write("")
        
        self.stdout.write(self.style.WARNING("💼 Tạo Jobs..."))
        jobs = self.create_jobs(companies, categories)
        self.stdout.write("")
        
        self.stdout.write("="*50)
        self.stdout.write(self.style.SUCCESS(f"✅ HOÀN TẤT!"))
        self.stdout.write(f"   - {len(categories)} categories")
        self.stdout.write(f"   - {len(companies)} companies")
        self.stdout.write(f"   - {len(jobs)} jobs")
        self.stdout.write("="*50 + "\n")
