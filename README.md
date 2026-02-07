# Architecture
```text
Project_Root
├── backend/                        # Server Side (Django)
│   ├── api/                        # Interface Layer
│   │   ├── controllers/            # (views) Xử lý request từ client
│   │   ├── schemas/                # (serializers) Validate và format dữ liệu
│   │   └── urls.py                 # Định tuyến API
│   ├── apps/                       # Service Layer (Business Logic)
│   │   ├── chatbot_services/       # Logic AI, LLM, Prompt Engineering
│   │   ├── cv_services.py          # Xử lý nghiệp vụ CV
│   │   └── ...
│   ├── database/                   # Data Access Layer
│   │   ├── models/                 # Các thực thể (Entities/Models)
│   │   └── migrations/             # Lịch sử thay đổi DB
│   ├── configs/                    # Configuration (Settings, Environment)
│   └── media/                      # Static files (CV uploads)
├── frontend/                       # Client Side (React + Vite)
    ├── src/
        ├── features/               # Các module tính năng (Feature-based)
        ├── infrastructure/         # API Client, Axios config
        └── shared/                 # UI Components dùng chung
```
# Download source code (CMD)

```bash
git clone https://github.com/duyhtd6649-maker/Project-CNPM.git
```

# Kiểm tra đã cài python & nodejs trên máy chưa

```bash
python --version
node --version
```

# Run app
## 1. Setup Backend (Django)

**Windows:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Unix/MacOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Setup Frontend (React)

Mở một terminal mới:

```bash
cd frontend
npm install
npm run dev
```

# Checklist
Các tính năng chia làm 3 mức: đã làm - chưa hoàn thiện - chưa làm
## Functional requirement
### Đã làm:
* Candidate:
   - Create a personal profile and upload CV (PDF/DOCX).
   - Receiving Analyzer results.
   - Using Career AI Coach and receiving a career roadmap.
   - Apply for jobs and view job recommendations based on skills and job description(Recommendation System).
   - Search for top companies
* Admin:
   - Admin login and account management (students, recruiters, admins).
   - Monitor system status, job posts, and approve/remove inappropriate content.
* Recruiter:
   - Post new job openings.
   - Create a recruiter organization account.
   - Shortlist, interview, and offer candidates.
### Chưa hoàn thiện:
   - Edit CV based on available CV template.
### Chưa làm:
* Candidate:
   - Sign up / Login with Email, Google, or OAuth.
   - Take quizzes (career orientation, skills).
   - View articles and company satisfaction rating.
   - Do challenges to get a badge(optional).
   - Buy a premium package.
* Admin Web System
   - Manage cabinets of knowledge (CV templates, interview questions, resources).
   - User package Management.
   - Generate system reports: users, jobs, skills in demand, application traffic.
   - Create Articles for Candidates to reference.
   - Monitor logs and analytics.
* Recruiter Dashboard
   - View candidate pipelines and job matching scores.
   - Finding appropriate candidates based on job description.
  
## Non-functional requirement:
   - CV upload and AI analysis completed in < 5 seconds (P95).
   - AI response time ≤ 3.5 seconds.
   - API response latency ≤ 400ms.
   - Security: JWT.


## Kế hoạch hoàn thiện
- Ưu tiên hoàn thiện UI cho các tính năng cốt lõi chưa hoàn thiện (core của dự án)
- Tích hợp đăng nhập bằng Email, Google, OAuth nhằm giúp người dùng dễ dàng trong khâu đăng nhập và quản lí tài khoản
- Tích hợp tính năng mock interview (cốt lõi của dự án)
- Recruiter Pipeline + Job Matching Scores (Khép kín quy trình tuyển dụng giữa Candidate & Recruiter).
- Admin Reports + Content Management (Công cụ quản trị hệ thống và nội dung).
- Premium Packages (Tính năng thương mại hóa và tăng tương tác).
