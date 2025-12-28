import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from .users import Candidates
from .AI import Airequest

class Cvs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    candidate = models.ForeignKey('Candidates', on_delete=models.CASCADE, db_column='CandidateId', blank=True, null=True,related_name='CV')  # Field name made lowercase.
    file_name = models.CharField(db_column='FileName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    file_url = models.CharField(db_column='FileUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'cvs'
        app_label = 'database'

class Cvanalysisresult(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    ai_request = models.ForeignKey('Airequest', on_delete=models.SET_NULL, db_column='AIRequestId', blank=True, null=True,related_name='cv_result')  # Field name made lowercase.
    cv = models.ForeignKey('Cvs', on_delete=models.CASCADE, db_column='CVId', blank=True, null=True,related_name='cv_result')  # Field name made lowercase.
    score = models.FloatField(db_column='Score', blank=True, null=True)  # Field name made lowercase.
    experience = models.JSONField(db_column='Experience', blank=True, null=True)  # Field name made lowercase.
    skill = models.JSONField(db_column='Skill', blank=True, null=True)  # Field name made lowercase.
    matchingkeyword = models.JSONField(db_column='MatchingKeyWord', blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'cvanalysisresult'
        app_label = 'database'

class Skills(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:        
        db_table = 'skills'
        app_label = 'database'