
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import CompanySignUpForm, CompanyProfileForm, JobPostingForm
from .models import CompanyProfile, JobPosting
from applications.models import Application


def company_register(request):
    if request.method == 'POST':
        form1 = CompanySignUpForm(request.POST)
        form2 = CompanyProfileForm(request.POST)
        if form1.is_valid() and form2.is_valid():
            user = form1.save(commit=False)
            user.is_company = True
            user.save()
            company = form2.save(commit=False)
            company.user = user
            company.save()
            login(request, user)
            return redirect('company_dashboard')
    else:
        form1 = CompanySignUpForm()
        form2 = CompanyProfileForm()
    return render(request, 'registration/company_register.html', {'form1': form1, 'form2': form2})

def company_dashboard(request):
    company = CompanyProfile.objects.get(user=request.user)
    jobs = JobPosting.objects.filter(company=company)
    return render(request, 'companies/dashboard.html', {'jobs': jobs})

def post_job(request):
    if request.method == 'POST':
        form = JobPostingForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.company = CompanyProfile.objects.get(user=request.user)
            job.save()
            return redirect('company_dashboard')
    else:
        form = JobPostingForm()
    return render(request, 'companies/post_job.html', {'form': form})

def view_applicants(request, job_id):
    job = JobPosting.objects.get(id=job_id)
    applicants = Application.objects.filter(job=job)
    return render(request, 'companies/view_applicants.html', {'job': job, 'applicants': applicants})
