import csv
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from ..models import Exercise, Set, SetGroup, Workout
from ..serializers import WorkoutSerializer
from django.db.models import Max
from rest_framework.permissions import IsAuthenticated

class SetRecordListView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        # Get all unique exercise names
        exercises = Exercise.objects.values_list('name', flat=True)

        record_weights = {}

        # Loop through each exercise to get the maximum weights for rep ranges
        for exercise in exercises:
            sets = (
                Set.objects
                .filter(set_group__exercise__name=exercise)
                .values('reps')
                .annotate(max_weight=Max('weight'))
                .order_by('reps')
            )

            weights_dict = {weight['reps']: weight['max_weight'] for weight in sets}
            record_weights[exercise] = weights_dict

        return Response({
            "exercises": list(exercises),
            "record_weights": record_weights
        })

class GetWorkoutBreakdownView(generics.GenericAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user).prefetch_related(
            'set_groups__sets', 'set_groups__exercise'
        )

class ExportWorkoutsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="workouts.csv"'

        writer = csv.writer(response)
        writer.writerow(['Date', 'Exercise', 'Set Order', 'Reps', 'Weight', 'Notes'])

        workouts = Workout.objects.filter(user=request.user).order_by('date')

        for workout in workouts:
            set_groups = SetGroup.objects.filter(workout=workout).order_by('order')
            for set_group in set_groups:
                sets = Set.objects.filter(set_group=set_group).order_by('order')
                for set_ in sets:
                    writer.writerow([workout.date, set_group.exercise.name, set_.order, set_.reps, set_.weight, workout.notes])

        return response
