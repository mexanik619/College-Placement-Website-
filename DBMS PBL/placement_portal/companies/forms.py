from django import forms
from django.contrib.auth.forms import UserCreationForm
from core.models import User
from .models import CompanyProfile, JobPosting

class CompanySignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class CompanyProfileForm(forms.ModelForm):
    class Meta:
        model = CompanyProfile
        fields = ['name', 'description', 'website']

class JobPostingForm(forms.ModelForm):
    class Meta:
        model = JobPosting
        fields = ['title', 'description', 'min_cgpa', 'eligible_departments', 'last_date_to_apply']
