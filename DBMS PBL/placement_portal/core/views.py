

# Create your views here.
from django.shortcuts import render
from companies.models import JobPosting

def home(request):
    # Get recent job postings to display on the homepage
    recent_jobs = JobPosting.objects.all().order_by('-created_at')[:5]
    return render(request, 'core/home.html', {'recent_jobs': recent_jobs})