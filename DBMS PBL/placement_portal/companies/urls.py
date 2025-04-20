from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.company_register, name='company_register'),
    path('dashboard/', views.company_dashboard, name='company_dashboard'),
    path('post-job/', views.post_job, name='post_job'),
    path('applicants/<int:job_id>/', views.view_applicants, name='view_applicants'),
]
