from django.contrib import admin

# Register your models here.

from .models import StudentProfile
from applications.models import Application  # ✅ Correct
  # To track student applications

admin.site.register(StudentProfile)
admin.site.register(Application)
