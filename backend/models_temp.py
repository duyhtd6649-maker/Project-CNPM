# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Airequest(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    inputhash = models.TextField(db_column='InputHash', blank=True, null=True)  # Field name made lowercase.
    output = models.JSONField(db_column='Output', blank=True, null=True)  # Field name made lowercase.
    typename = models.CharField(db_column='TypeName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'airequest'


class Applications(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    jobid = models.ForeignKey('Jobs', models.DO_NOTHING, db_column='JobId', blank=True, null=True)  # Field name made lowercase.
    candidateid = models.ForeignKey('Candidates', models.DO_NOTHING, db_column='CandidateId', blank=True, null=True)  # Field name made lowercase.
    cvsid = models.ForeignKey('Cvs', models.DO_NOTHING, db_column='CvsId', blank=True, null=True)  # Field name made lowercase.
    coverletter = models.CharField(db_column='CoverLetter', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=20, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'applications'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class Candidates(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserId', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=500, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=255, blank=True, null=True)  # Field name made lowercase.
    dateofbirth = models.DateField(db_column='DateOfBirth', blank=True, null=True)  # Field name made lowercase.
    opentowork = models.TextField(db_column='OpenToWork', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    currentjobtitle = models.CharField(db_column='CurrentJobTitle', max_length=100, blank=True, null=True)  # Field name made lowercase.
    expectedsalary = models.CharField(db_column='ExpectedSalary', max_length=255, blank=True, null=True)  # Field name made lowercase.
    experience = models.JSONField(db_column='Experience', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'candidates'


class Categories(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'categories'


class Companies(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    website = models.CharField(db_column='Website', max_length=255, blank=True, null=True)  # Field name made lowercase.
    logourl = models.CharField(db_column='LogoUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=255, blank=True, null=True)  # Field name made lowercase.
    taxcode = models.CharField(db_column='TaxCode', max_length=50, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'companies'


class Conversation(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'conversation'


class Cvanalysisresult(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    airequestid = models.ForeignKey(Airequest, models.DO_NOTHING, db_column='AIRequestId', blank=True, null=True)  # Field name made lowercase.
    cvsid = models.ForeignKey('Cvs', models.DO_NOTHING, db_column='CVsId', blank=True, null=True)  # Field name made lowercase.
    score = models.FloatField(db_column='Score', blank=True, null=True)  # Field name made lowercase.
    experience = models.JSONField(db_column='Experience', blank=True, null=True)  # Field name made lowercase.
    skill = models.JSONField(db_column='Skill', blank=True, null=True)  # Field name made lowercase.
    matchingkeyword = models.JSONField(db_column='MatchingKeyWord', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        
        db_table = 'cvanalysisresult'


class Cvs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    candidateid = models.ForeignKey(Candidates, models.DO_NOTHING, db_column='CandidateId', blank=True, null=True)  # Field name made lowercase.
    filename = models.CharField(db_column='FileName', max_length=255, blank=True, null=True)  # Field name made lowercase.
    fileurl = models.CharField(db_column='FileUrl', max_length=500, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'cvs'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user_id = models.BigIntegerField()

    class Meta:
        
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        
        db_table = 'django_session'


class Jobmatching(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    airequestid = models.ForeignKey(Airequest, models.DO_NOTHING, db_column='AIRequestId', blank=True, null=True)  # Field name made lowercase.
    candidateid = models.ForeignKey(Candidates, models.DO_NOTHING, db_column='CandidateId', blank=True, null=True)  # Field name made lowercase.
    jobid = models.ForeignKey('Jobs', models.DO_NOTHING, db_column='JobId', blank=True, null=True)  # Field name made lowercase.
    matchscore = models.FloatField(db_column='MatchScore', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'jobmatching'


class Jobs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    recruiterid = models.ForeignKey('Recruiters', models.DO_NOTHING, db_column='RecruiterId', blank=True, null=True)  # Field name made lowercase.
    categoriesid = models.ForeignKey(Categories, models.DO_NOTHING, db_column='CategoriesId', blank=True, null=True)  # Field name made lowercase.
    companiesid = models.ForeignKey(Companies, models.DO_NOTHING, db_column='CompaniesId', blank=True, null=True)  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=255)  # Field name made lowercase.
    description = models.TextField(db_column='Description', blank=True, null=True)  # Field name made lowercase.
    requirement = models.JSONField(db_column='Requirement', blank=True, null=True)  # Field name made lowercase.
    salarymin = models.IntegerField(db_column='SalaryMin', blank=True, null=True)  # Field name made lowercase.
    salarymax = models.IntegerField(db_column='SalaryMax', blank=True, null=True)  # Field name made lowercase.
    location = models.CharField(db_column='Location', max_length=255, blank=True, null=True)  # Field name made lowercase.
    deadline = models.DateField(db_column='Deadline', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'jobs'


class Message(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    conversationid = models.ForeignKey(Conversation, models.DO_NOTHING, db_column='ConversationId', blank=True, null=True)  # Field name made lowercase.
    senderid = models.ForeignKey('Users', models.DO_NOTHING, db_column='SenderId', blank=True, null=True)  # Field name made lowercase.
    receiverid = models.ForeignKey('Users', models.DO_NOTHING, db_column='ReceiverId', related_name='message_receiverid_set', blank=True, null=True)  # Field name made lowercase.
    content = models.TextField(db_column='Content', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'message'


class Notifications(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserId', blank=True, null=True)  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=255, blank=True, null=True)  # Field name made lowercase.
    message = models.CharField(db_column='Message', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    type = models.CharField(db_column='Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    isread = models.TextField(db_column='IsRead', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        
        db_table = 'notifications'


class Packages(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    price = models.DecimalField(db_column='Price', max_digits=18, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    durationdays = models.IntegerField(db_column='DurationDays', blank=True, null=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        
        db_table = 'packages'


class Recruiters(models.Model):
    userid = models.OneToOneField('Users', models.DO_NOTHING, db_column='UserId', primary_key=True)  # Field name made lowercase.
    companiesid = models.CharField(db_column='CompaniesId', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'recruiters'


class Refreshtokens(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserId', blank=True, null=True)  # Field name made lowercase.
    token = models.CharField(db_column='Token', max_length=255, blank=True, null=True)  # Field name made lowercase.
    revoked = models.CharField(db_column='Revoked', max_length=255, blank=True, null=True)  # Field name made lowercase.
    publickey = models.CharField(db_column='PublicKey', max_length=255, blank=True, null=True)  # Field name made lowercase.
    useragent = models.CharField(db_column='UserAgent', max_length=255, blank=True, null=True)  # Field name made lowercase.
    ipaddress = models.CharField(db_column='IPAddress', max_length=255, blank=True, null=True)  # Field name made lowercase.
    expires = models.DateField(db_column='Expires', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'refreshtokens'


class Roles(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    rolename = models.CharField(db_column='RoleName', max_length=255)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        
        db_table = 'roles'


class Skills(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    updatedby = models.CharField(db_column='UpdatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    note = models.CharField(db_column='Note', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'skills'


class Subscriptions(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserId', blank=True, null=True)  # Field name made lowercase.
    packageid = models.ForeignKey(Packages, models.DO_NOTHING, db_column='PackageId', blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=20, blank=True, null=True)  # Field name made lowercase.
    enddate = models.DateField(db_column='EndDate', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    isdeleted = models.TextField(db_column='IsDeleted', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        
        db_table = 'subscriptions'


class Systemlogs(models.Model):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255)  # Field name made lowercase.
    systemid = models.CharField(db_column='SystemId', max_length=255, blank=True, null=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='UserId', blank=True, null=True)  # Field name made lowercase.
    level = models.CharField(db_column='Level', max_length=20, blank=True, null=True)  # Field name made lowercase.
    action = models.CharField(db_column='Action', max_length=255, blank=True, null=True)  # Field name made lowercase.
    message = models.CharField(db_column='Message', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    ipaddress = models.CharField(db_column='IPAddress', max_length=50, blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    createdby = models.CharField(db_column='CreatedBy', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        
        db_table = 'systemlogs'


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
        
        db_table = 'users'
