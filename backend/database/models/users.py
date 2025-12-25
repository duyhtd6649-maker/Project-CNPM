from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    username = models.CharField(db_column='Username', unique=True, max_length=255)  # Field name made lowercase.
    password = models.CharField(db_column='Password', max_length=255)  # Field name made lowercase.
    email = models.CharField(db_column='Email', unique=True, max_length=255)  # Field name made lowercase.
    phone = models.CharField(db_column='Phone', max_length=255, blank=True, null=True)  # Field name made lowercase.
    fullname = models.CharField(db_column='Fullname', max_length=255, blank=True, null=True)  # Field name made lowercase.
    avatarurl = models.CharField(db_column='AvatarUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    authprovider = models.CharField(db_column='AuthProvider', max_length=100, blank=True, null=True)  # Field name made lowercase.
    isactive = models.TextField(db_column='IsActive', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Users'
    app_label = 'database'
    def __str__(self):
        return self.username
    