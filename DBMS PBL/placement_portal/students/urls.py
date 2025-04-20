from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.student_register, name='student_register'),
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
    path('apply/<int:job_id>/', views.apply_job, name='apply_job'),
]
