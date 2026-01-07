import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    ROLE_CHOICES = (
        ("recruiter", "Recruiter"),
        ("candidate", "Candidate"),
    )
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=uuid.uuid4, editable=False)  # Field name made lowercase.
    role = models.CharField(db_column='Role', max_length= 255, choices=ROLE_CHOICES,  null= True)
    phone = models.CharField(db_column='Phone', max_length=255, blank=True, null=True)  # Field name made lowercase.
    email = models.EmailField(unique=True, null=False, blank=False)
    company = models.ForeignKey('Companies', on_delete= models.SET_NULL, db_column='CompanyId', related_name='User',null= True)
    fullname = models.CharField(db_column='Fullname', max_length=255, blank=True, null=True)  # Field name made lowercase.
    avatar_url = models.ImageField(upload_to='ava/%Y/%m', null=True, db_column='AvatarUrl') # Field name made lowercase.
    auth_provider = models.CharField(db_column='AuthProvider', max_length=100, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted',default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.
    

    class Meta:
        db_table = 'Users'
        app_label = 'database'
    def __str__(self):
        return f"User: {self.username}"
    
class Recruiters(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='UserId',related_name='recruiter')  # Field name made lowercase.

    class Meta:
        db_table = 'Recruiters'
        app_label = 'database'
    
class Candidates(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='UserId',related_name='candidate_profile')  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=500, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=255, blank=True, null=True)  # Field name made lowercase.
    date_of_birth = models.DateField(db_column='DateOfBirth', blank=True, null=True)  # Field name made lowercase.
    is_open_to_work = models.BooleanField(db_column='OpenToWork', default=False)  # Field name made lowercase. This field type is a guess.
    current_job_title = models.CharField(db_column='CurrentJobTitle', max_length=100, blank=True, null=True)  # Field name made lowercase.
    expected_salary = models.BigIntegerField(db_column='ExpectedSalary', blank=True, null=True)  # Field name made lowercase.
    experience = models.JSONField(db_column='Experience', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Candidates'
        app_label = 'database'
    def __str__(self):
        return f"Candidate: {self.user.username}"



class Companies(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, unique=True,null=False,blank=False)  # Field name made lowercase.
    description = models.TextField(db_column='Description', blank=True, null=True)  # Field name made lowercase.
    website = models.CharField(db_column='Website', max_length=255, blank=True, null=True)  # Field name made lowercase.
    logo_url = models.CharField(db_column='LogoUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=255, blank=True, null=True)  # Field name made lowercase.
    tax_code = models.CharField(db_column='TaxCode', max_length=50, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'companies'
        app_label = 'database'
    def __str__(self):
        return f"Company: {self.name}"
