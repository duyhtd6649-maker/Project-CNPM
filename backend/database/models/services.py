import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from .users import Candidates, Users, Admins
from .AI import Airequest

class Auditlogs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    Actor = models.ForeignKey('Users',on_delete=models.CASCADE,db_column='ActorId',blank=True,related_name='audit_logs')
    entity_type = models.CharField(db_column='EntityType',max_length=255,blank=True)
    entity_id = models.CharField(db_column='EntityId',max_length=255,blank=True)
    action = models.CharField(db_column='Action', max_length=255, blank=True, null=True)  # Field name made lowercase.
    detail = models.JSONField(db_column='Detail',blank=True)
    ip_address = models.CharField(db_column='IPAddress', max_length=255, blank=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:        
        db_table = 'systemlogs'
        app_label = 'database'

class Conversation(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=False)  # Field name made lowercase.

    class Meta:
        db_table = 'conversation'
        app_label = 'database'

class Message(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    conversation = models.ForeignKey('Conversation', on_delete=models.CASCADE, db_column='ConversationId', blank=True,related_name='messages')  # Field name made lowercase.
    sender = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='SenderId', blank=True,related_name='message_sended')  # Field name made lowercase.
    receiver = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='ReceiverId', blank=True,related_name='message_received')  # Field name made lowercase.
    content = models.TextField(db_column='Content', blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.
 
    class Meta:
        db_table = 'message'
        app_label = 'database'

class Notifications(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    sender = models.ForeignKey('Admins', on_delete=models.SET_NULL, db_column='SenderId', blank=True,null= True,related_name='notifications_sended')  # Field name made lowercase.
    receiver = models.ManyToManyField('Users', through='NotificationReceivers',related_name='notifications_received')  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=255, blank=True, null=True)  # Field name made lowercase.
    message = models.TextField(db_column='Message')  # Field name made lowercase.
    type =  models.CharField(db_column='Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.


    class Meta:
        db_table = 'notifications'
        app_label = 'database'

class NotificationReceivers(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    notification = models.ForeignKey(Notifications, on_delete=models.CASCADE, db_column='NotificationId')
    user = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='ReceiverId')
    is_read = models.BooleanField(db_column='IsRead', default=False)
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    read_date = models.DateTimeField(db_column='ReadDate',blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'notificationsreceivers'
        app_label = 'database'

class Packages(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255,default=uuid.uuid4,editable=False)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    price = models.DecimalField(db_column='Price', max_digits=18, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    duration_days = models.IntegerField(db_column='DurationDays', blank=True, null=True)  # Field name made lowercase.
    description = models.TextField(db_column='Description', blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'packages'
        app_label = 'database'

class Subscriptions(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    user = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId', blank=True,related_name='subscriptions')  # Field name made lowercase.
    package = models.ForeignKey('Packages', on_delete=models.SET_NULL, db_column='PackageId', blank=True,null=True, related_name='subscriptions')  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=20, blank=True, null=True)  # Field name made lowercase.
    end_date = models.DateTimeField(db_column='EndDate', blank=True, null=True)  # Field name made lowercase.
    created_date = models.DateTimeField(db_column='CreatedDate', auto_now_add=True, null=True)  # Field name made lowercase.
    created_by = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated_date = models.DateTimeField(db_column='UpdatedDate', auto_now=True, null=True)  # Field name made lowercase.
    updated_by = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.BooleanField(db_column='IsDeleted', default=False)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'subscriptions'
        app_label = 'database'