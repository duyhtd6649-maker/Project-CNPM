from django.db import models
from .base import AuditableModel

class Conversation(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=models.UUIDField, editable=False)  # Field name made lowercase.
    user = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId', related_name='conversations', null=True)
    target_job = models.CharField(db_column='TargetJob', max_length=100)
    level = models.CharField(db_column='Level', max_length=50)
    max_turns = models.IntegerField(db_column='Maxturn', default=5)
    is_finished = models.BooleanField(db_column='IsFinished', default=False)
    final_score = models.IntegerField(db_column='FinalScore', null=True, blank=True)
    class Meta:
        db_table = 'conversation'
        app_label = 'database'
    def __str__(self):
        return f"[{self.id}] {self.target_job} - {self.level}"

class Message(AuditableModel):
    id = models.CharField(db_column='Id', primary_key=True, max_length=255, default=models.UUIDField, editable=False)  # Field name made lowercase.
    class Role(models.TextChoices):
        USER = "user", "User"
        ASSISTANT = "assistant", "Assistant"

    conversation = models.ForeignKey(
        'Conversation',
        on_delete=models.CASCADE,
        db_column='ConversationId',
        related_name="messages"
    )
    role = models.CharField(
        db_column='Role',
        max_length=10,
        choices=Role.choices
    )
    content = models.JSONField(db_column='Content')
    turn_index = models.IntegerField(db_column='TurnIndex')
    class Meta:
        db_table = 'message'
        app_label = 'database'