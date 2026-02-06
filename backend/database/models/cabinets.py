import uuid
from django.db import models
from .base import AuditableModel

class CvTemplate(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    name = models.CharField(db_column='Name', max_length=255)
    image_url = models.CharField(db_column='ImageUrl', max_length=500, blank=True, null=True)
    file_url = models.FileField(db_column='FileUrl', upload_to='templates/cv/', blank=True, null=True)
    description = models.TextField(db_column='Description', blank=True, null=True)

    class Meta:
        db_table = 'cv_templates'
        app_label = 'database'
        ordering = ['-created_date']

class InterviewQuestion(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    question = models.TextField(db_column='Question')
    category = models.CharField(db_column='Category', max_length=100) # e.g., JavaScript, React
    difficulty = models.CharField(db_column='Difficulty', max_length=50) # Easy, Medium, Hard
    
    class Meta:
        db_table = 'interview_questions'
        app_label = 'database'
        ordering = ['-created_date']

class Resource(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    title = models.CharField(db_column='Title', max_length=255)
    type = models.CharField(db_column='Type', max_length=50) # PDF, DOCX, XLSX
    file = models.FileField(db_column='File', upload_to='resources/')
    size = models.CharField(db_column='Size', max_length=50, blank=True, null=True) # e.g., "2.4 MB"

    class Meta:
        db_table = 'resources'
        app_label = 'database'
        ordering = ['-created_date']
