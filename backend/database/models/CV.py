import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from .users import Candidates
from .base import AuditableModel

class Cvs(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    candidate = models.ForeignKey('Candidates', on_delete=models.CASCADE, db_column='CandidateId', blank=True,related_name='CV', null=True)  # Field name made lowercase.
    file_name = models.CharField(db_column='FileName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    file_url = models.FileField(upload_to='cvs/%Y/%m/', null=True, db_column='FileUrl')
    file_hash = models.CharField(db_column='FileHash',max_length=64, null=True, blank=True,db_index=True)
    file_size = models.IntegerField(db_column='FileSize', null=True, blank=True)

    class Meta:
        db_table = 'cvs'
        app_label = 'database'
    def save(self, *args, **kwargs):
        if self.file_url and not self.file_size:
            self.file_size = self.file_url.size
        super().save(*args, **kwargs)

class Cvanalysisresult(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    cv = models.ForeignKey('Cvs', on_delete=models.CASCADE, db_column='CVId', blank=True, null=True, related_name='analysis_results')
    target_job = models.CharField(db_column='TargetJob', max_length=255, blank=True, null=True)
    overall_score = models.FloatField(db_column='OverallScore', default=0.0, db_index=True)
    content_score = models.FloatField(db_column='ContentScore', default=0.0)
    format_score = models.FloatField(db_column='FormatScore', default=0.0)
    ai_response_json = models.JSONField(db_column='AIResponseJson', blank=True, null=True)
    format_analysis_json = models.JSONField(db_column='FormatAnalysisJson', blank=True, null=True)
    extracted_email = models.CharField(db_column='ExtractedEmail', max_length=255, blank=True, null=True)
    extracted_phone = models.CharField(db_column='ExtractedPhone', max_length=50, blank=True, null=True)
    extracted_skill = models.JSONField(db_column='ExtractedSkill',blank=True,null=True,default=list)


    class Meta:
        db_table = 'cvanalysisresult'
        app_label = 'database'
        ordering = ['-overall_score']

    def save(self, *args, **kwargs):
        c_score = self.content_score if self.content_score else 0
        f_score = self.format_score if self.format_score else 0
        
        self.overall_score = round((c_score * 0.7) + (f_score * 0.3), 2)
        super().save(*args, **kwargs)

class CareerRoadMap(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)
    cv = models.ForeignKey('Cvs', on_delete=models.SET_NULL, db_column='CVId', blank=True, null=True, related_name='career_roadmaps')
    target_job = models.CharField(db_column='TargetJob', max_length=255, blank=True, null=True)
    candidate = models.ForeignKey('Candidates', on_delete=models.CASCADE, db_column='CandidateId', blank=True, null=True, related_name='career_roadmaps')
    roadmap_json = models.JSONField(db_column='RoadmapJson', blank=True, null=True)
    class Meta:
        db_table = 'careerroadmap'
        app_label = 'database'

