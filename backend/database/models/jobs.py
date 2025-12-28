import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from .users import Companies, Candidates
from .AI import Airequest
from .CV import Cvs

class Categories(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'categories'
        app_label = 'database'

class Jobs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    recruiter = models.ForeignKey('Recruiters', on_delete=models.SET_NULL, db_column='RecruiterId', blank=True, null=True,related_name='jobs')  # Field name made lowercase.
    category = models.ForeignKey('Categories', on_delete=models.SET_NULL, db_column='CategoryId',null=True,blank=True,related_name='jobs')  # Field name made lowercase.
    companiesid = models.ForeignKey('Companies', on_delete=models.SET_NULL, db_column='CompanyId',null=True,blank=True,related_name='jobs')  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=255)  # Field name made lowercase.
    description = models.TextField(db_column='Description', blank=True, null=True)  # Field name made lowercase.
    requirement = models.JSONField(db_column='Requirement', blank=True, null=True)  # Field name made lowercase.
    salarymin = models.IntegerField(db_column='SalaryMin', blank=True, null=True)  # Field name made lowercase.
    salarymax = models.IntegerField(db_column='SalaryMax', blank=True, null=True)  # Field name made lowercase.
    location = models.CharField(db_column='Location', max_length=255, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'jobs'
        app_label = 'database'

class Applications(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    jobid = models.ForeignKey('Jobs', on_delete=models.CASCADE, db_column='JobId', blank=True, null=True,related_name='applications')  # Field name made lowercase.
    candidateid = models.ForeignKey('Candidates', on_delete=models.CASCADE, db_column='CandidateId', blank=True, null=True,related_name='applications')  # Field name made lowercase.
    cvsid = models.ForeignKey('Cvs', on_delete=models.SET_NULL, db_column='CvId', blank=True, null=True,related_name='applications')  # Field name made lowercase.
    coverletter = models.CharField(db_column='CoverLetter', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=20, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'applications'
        app_label = 'database'

class Jobmatching(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    airequestid = models.ForeignKey('Airequest', on_delete=models.SET_NULL, db_column='AIRequestId', blank=True, null=True,related_name='Jobmatching')  # Field name made lowercase.
    candidateid = models.ForeignKey('Candidates', on_delete=models.CASCADE, db_column='CandidateId', blank=True, null=True,related_name='Jobmatching')  # Field name made lowercase.
    jobid = models.ForeignKey('Jobs', on_delete=models.CASCADE, db_column='JobId', blank=True, null=True,related_name='Jobmatching')  # Field name made lowercase.
    matchscore = models.FloatField(db_column='MatchScore', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'jobmatching'
        app_label = 'database'
