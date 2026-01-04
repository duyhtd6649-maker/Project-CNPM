from allauth.account.forms import SignupForm
from .users import  Candidates, Recruiters
from django import forms

class CustomSignupForm(SignupForm):
    ROLE_CHOICES = (
        ("recruiter", "Recruiter"),
        ("candidate", "Candidate"),
    )
    role = forms.ChoiceField(choices=ROLE_CHOICES, required=True)

    def save(self, request):
        user2 = super().save(request)
        user2.role = self.cleaned_data["role"]
        user2.save()
        if user2.role == 'candidate':
            Candidates.objects.create(user = user2)
            return user2
        if user2.role == 'recruiter':
            Recruiters.objects.create(user = user2)
            return user2

