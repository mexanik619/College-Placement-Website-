from django import forms
from django.contrib.auth.forms import UserCreationForm
from core.models import User
from .models import StudentProfile

class StudentSignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = StudentProfile
        fields = ['roll_number', 'department', 'cgpa', 'skills', 'resume']
