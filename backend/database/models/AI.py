import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

class Airequest(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    input_hash = models.TextField(db_column='InputHash', blank=True, null=True)  # Field name made lowercase.
    output = models.JSONField(db_column='Output', blank=True, null=True)  # Field name made lowercase.
    typename = models.CharField(db_column='TypeName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'airequest'
        app_label='database'