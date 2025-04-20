from django.db import models

# Create your models here.
from core.models import User

# from applications.models import Application

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=15, unique=True)
    department = models.CharField(max_length=100)
    cgpa = models.FloatField()
    resume = models.FileField(upload_to='resumes/')
    skills = models.TextField()
