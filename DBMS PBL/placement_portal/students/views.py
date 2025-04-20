

def student_dashboard(request):
    student = StudentProfile.objects.get(user=request.user)
    jobs = JobPosting.objects.filter(min_cgpa__lte=student.cgpa)
    return render(request, 'students/dashboard.html', {'jobs': jobs})

def apply_job(request, job_id):
    job = JobPosting.objects.get(id=job_id)
    student = StudentProfile.objects.get(user=request.user)
    Application.objects.create(student=student, job=job)
    return redirect('student_dashboard')

from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import StudentSignUpForm, StudentProfileForm
from applications.models import Application
from students.models import StudentProfile
from .models import StudentProfile  # ✅ Only import this from students app
from applications.models import Application  # ✅ Get Application from correct app


def student_register(request):
    if request.method == 'POST':
        form1 = StudentSignUpForm(request.POST)
        form2 = StudentProfileForm(request.POST, request.FILES)
        if form1.is_valid() and form2.is_valid():
            user = form1.save(commit=False)
            user.is_student = True
            user.save()
            student = form2.save(commit=False)
            student.user = user
            student.save()
            login(request, user)
            return redirect('student_dashboard')
    else:
        form1 = StudentSignUpForm()
        form2 = StudentProfileForm()
    return render(request, 'registration/register.html', {'form1': form1, 'form2': form2})

def student_dashboard(request):
    student = StudentProfile.objects.get(user=request.user)
    jobs = JobPosting.objects.filter(min_cgpa__lte=student.cgpa)
    return render(request, 'students/dashboard.html', {'jobs': jobs})

def apply_job(request, job_id):
    job = JobPosting.objects.get(id=job_id)
    student = StudentProfile.objects.get(user=request.user)
    Application.objects.create(student=student, job=job)
    return redirect('student_dashboard')
