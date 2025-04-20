from django.contrib import admin

# Register your models here.
from .models import CompanyProfile, JobPosting

admin.site.register(CompanyProfile)
admin.site.register(JobPosting)
