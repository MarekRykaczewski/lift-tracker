from django.urls import path
from .views import WorkoutListCreateView, WorkoutDetailView, SetListCreateView, ExerciseListView

urlpatterns = [
    path('workouts/', WorkoutListCreateView.as_view(), name='workout-list-create'),
    path('workouts/<str:date>/', WorkoutDetailView.as_view(), name='workout-detail-view'),
    path('workouts/<str:date>/sets/', SetListCreateView.as_view(), name='set-create'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list')
]