from django.urls import path
from .views import WorkoutListCreateView, WorkoutDetailView, SetListCreateView, SetGroupListCreateView, ExerciseListView

urlpatterns = [
    path('workouts/', WorkoutListCreateView.as_view(), name='workout-list-create'),
    path('workouts/<str:date>/', WorkoutDetailView.as_view(), name='workout-detail-view'),
    path('workouts/<str:date>/set-groups/', SetGroupListCreateView.as_view(), name='setgroup-list-create'),
    path('workouts/set-groups/<int:set_group_id>/sets/', SetListCreateView.as_view(), name='set-list-create'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
]