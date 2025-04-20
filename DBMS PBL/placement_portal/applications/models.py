from django.db import models

from companies.models import JobPosting


# Create your models here.
class Application(models.Model):
    student = models.ForeignKey('students.StudentProfile', on_delete=models.CASCADE)
    job = models.ForeignKey('companies.JobPosting', on_delete=models.CASCADE)
    applied_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    ], default='applied')
