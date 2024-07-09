from django.urls import path
from .views import ExportWorkoutsView, GetWorkoutBreakdownView, MoveWorkoutView, WorkoutCopyView, WorkoutDestroyView, WorkoutListCreateView, WorkoutDetailView, SetListCreateView, SetGroupListCreateView, SetGroupDestroyView, ExerciseListView, SetRetrieveUpdateDestroyView, UserProfileView

urlpatterns = [
    path('workouts/', WorkoutListCreateView.as_view(), name='workout-list-create'),
    path('workout-breakdown', GetWorkoutBreakdownView.as_view(), name='workout-breakdown'),
    path('workouts/export/', ExportWorkoutsView.as_view(), name='export_workouts'),
    path('workouts/<int:pk>/', WorkoutDestroyView.as_view(), name='workout-destroy'),
    path('workouts/<str:date>/', WorkoutDetailView.as_view(), name='workout-detail-view'),
    path('workouts/<str:date>/copy/', WorkoutCopyView.as_view(), name='workout-copy'),
    path('workouts/<str:date>/move/', MoveWorkoutView.as_view(), name='move_workout'),
    path('workouts/<str:date>/set-groups/', SetGroupListCreateView.as_view(), name='setgroup-list-create'),
    path('workouts/set-groups/<int:set_group_id>/sets/', SetListCreateView.as_view(), name='set-list-create'),
    path('workouts/set-groups/<int:set_group_id>/sets/<int:pk>/', SetRetrieveUpdateDestroyView.as_view(), name='set-retrieve-update-destroy'),
    path('workouts/set-groups/<int:pk>/', SetGroupDestroyView.as_view(), name='setgroup-destroy'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),
]