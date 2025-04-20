from django.db import models

# Create your models here.
from core.models import User

class CompanyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    website = models.URLField()

class JobPosting(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    min_cgpa = models.FloatField()
    eligible_departments = models.JSONField()
    last_date_to_apply = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
