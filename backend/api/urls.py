from django.urls import path
from .views import WorkoutListCreateView

urlpatterns = [
    path('workouts/', WorkoutListCreateView.as_view(), name='workout-list-create'),
]
