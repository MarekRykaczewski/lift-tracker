from django.urls import path
from .views import (
    ExportWorkoutsView, GetWorkoutBreakdownView, MoveWorkoutView, 
    SetRecordListView, UpdateSetOrderView, UpdateSetGroupOrderView, 
    WorkoutCopyView, WorkoutDestroyView, WorkoutListCreateView, 
    WorkoutDetailView, SetListCreateView, SetGroupListCreateView, 
    SetGroupDestroyView, ExerciseListView, SetRetrieveUpdateDestroyView, 
    UserProfileView
)

urlpatterns = [
    # Workout-related routes
    path('workouts/', WorkoutListCreateView.as_view(), name='workout-list'),  # GET (list), POST (create)
    path('workouts/export/', ExportWorkoutsView.as_view(), name='workout-export'),  # GET (export)
    path('workouts/<str:date>/', WorkoutDetailView.as_view(), name='workout-detail'),  # GET (retrieve), PATCH (update)
    path('workouts/<int:pk>/destroy', WorkoutDestroyView.as_view(), name='workout-destroy'), # DELETE (delete workout)
    path('workouts/<str:date>/copy/', WorkoutCopyView.as_view(), name='workout-copy'),  # POST (copy workout)
    path('workouts/<str:date>/move/', MoveWorkoutView.as_view(), name='workout-move'),  # POST (move workout)
    path('workouts/<str:date>/breakdown/', GetWorkoutBreakdownView.as_view(), name='workout-breakdown'),  # GET (workout breakdown)

    # Set group-related routes (nested under workouts)
    path('workouts/<str:date>/set-groups/', SetGroupListCreateView.as_view(), name='set-group-list-create'),  # GET (list), POST (create set group)
    path('workouts/<str:date>/set-groups/order/', UpdateSetGroupOrderView.as_view(), name='set-group-order-update'),  # PATCH (update set group order)
    path('workouts/set-groups/<int:pk>/', SetGroupDestroyView.as_view(), name='set-group-destroy'),  # DELETE (destroy set group)

    # Set-related routes (nested under set groups)
    path('set-groups/<int:set_group_id>/sets/', SetListCreateView.as_view(), name='set-list-create'),  # GET (list sets), POST (create set)
    path('set-groups/<int:set_group_id>/sets/order/', UpdateSetOrderView.as_view(), name='set-order-update'),  # PATCH (update set order)
    path('set-groups/<int:set_group_id>/sets/<int:pk>/', SetRetrieveUpdateDestroyView.as_view(), name='set-retrieve-update-destroy'),  # GET (retrieve), PATCH (update), DELETE (destroy set)

    # Sets-related records
    path('sets/records/', SetRecordListView.as_view(), name='set-record-list'),  # GET (list set records)

    # Exercise-related routes
    path('exercises/', ExerciseListView.as_view(), name='exercise-list'),  # GET (list exercises)

    # User-related routes
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),  # GET (user profile)
]
