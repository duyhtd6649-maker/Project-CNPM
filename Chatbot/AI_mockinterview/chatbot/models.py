from django.db import models


class Conversation(models.Model):
    job = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    max_turns = models.IntegerField(default=5)
    is_finished = models.BooleanField(default=False)
    final_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.id}] {self.job} - {self.level}"


class Message(models.Model):
    class Role(models.TextChoices):
        USER = "user", "User"
        ASSISTANT = "assistant", "Assistant"

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(
        max_length=10,
        choices=Role.choices
    )
    content = models.TextField()
    turn_index = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
