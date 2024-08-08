from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import MoveWorkoutSerializer, UserSerializer, UserProfileSerializer, WorkoutSerializer, SetSerializer, SetGroupSerializer, ExerciseSerializer
from .models import User, Workout, Set, SetGroup, Exercise
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.http import Http404
from datetime import datetime
from django.http import HttpResponse
from django.db.models import Max
import csv

User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class WorkoutListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        year = self.request.query_params.get('year', None)
        if year:
            return Workout.objects.filter(user=user, date__year=year)
        return Workout.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class WorkoutDetailView(generics.RetrieveAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'date' 

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        filter_kwargs = {
            self.lookup_field: self.kwargs[self.lookup_field],
            'user': self.request.user
        }
        try:
            obj = queryset.get(**filter_kwargs)
        except Workout.MultipleObjectsReturned:
            obj = queryset.filter(**filter_kwargs).first()
        except Workout.DoesNotExist:
            raise Http404("Workout not found")
        return obj
    
class SetGroupListCreateView(generics.ListCreateAPIView):
    queryset = SetGroup.objects.all()
    serializer_class = SetGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        date = self.kwargs['date']
        try:
            workout = Workout.objects.get(date=date, user=self.request.user)
            return SetGroup.objects.filter(workout=workout)
        except Workout.DoesNotExist:
            return SetGroup.objects.none()

    def perform_create(self, serializer):
        date = self.kwargs['date']
        try:
            workout = Workout.objects.get(date=date, user=self.request.user)
            set_group = serializer.save(workout=workout)

            Set.objects.create(
                set_group=set_group,
                order=1,
                reps=0,
                weight=0
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Workout.DoesNotExist:
            raise Http404("Workout not found")
    
class SetListCreateView(generics.ListCreateAPIView):
    queryset = Set.objects.all()
    serializer_class = SetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        set_group_id = self.kwargs['set_group_id']
        try:
            set_group = SetGroup.objects.get(id=set_group_id, workout__user=self.request.user)
            return Set.objects.filter(set_group=set_group)
        except SetGroup.DoesNotExist:
            return Set.objects.none()

    def perform_create(self, serializer):
        set_group_id = self.kwargs['set_group_id']
        try:
            set_group = SetGroup.objects.get(id=set_group_id, workout__user=self.request.user)
            serializer.save(set_group=set_group)
        except SetGroup.DoesNotExist:
            raise Http404("SetGroup not found")
        
class ExerciseListView(generics.ListAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class SetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Set.objects.all()
    serializer_class = SetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        set_group_id = self.kwargs['set_group_id']
        try:
            set_group = SetGroup.objects.get(id=set_group_id, workout__user=self.request.user)
            return Set.objects.filter(set_group=set_group)
        except SetGroup.DoesNotExist:
            return Set.objects.none()

    def get_object(self):
        queryset = self.get_queryset()
        filter_kwargs = {
            'id': self.kwargs['pk'],
            'set_group__workout__user': self.request.user
        }
        try:
            obj = queryset.get(**filter_kwargs)
        except Set.DoesNotExist:
            raise Http404("Set not found")
        return obj
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
class SetGroupDestroyView(generics.DestroyAPIView):
    queryset = SetGroup.objects.all()
    serializer_class = SetGroupSerializer
    permission_classes = [IsAuthenticated]

class WorkoutDestroyView(generics.DestroyAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        workout_id = self.kwargs['pk']
        user = self.request.user
        try:
            return Workout.objects.get(id=workout_id, user=user)
        except Workout.DoesNotExist:
            raise Http404("Workout not found")
    
    def delete(self, request, *args, **kwargs):
        workout = self.get_object()
        self.perform_destroy(workout)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class WorkoutCopyView(generics.GenericAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        source_date = self.kwargs['date']
        target_date = request.data.get('target_date')

        if not target_date:
            return Response({'detail': 'Target date is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            source_date = datetime.strptime(source_date, '%Y-%m-%d').date()
            target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'detail': 'Invalid date format.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            source_workout = Workout.objects.get(date=source_date, user=user)
        except Workout.DoesNotExist:
            raise Http404("Source workout not found")
        
        existing_workout = Workout.objects.filter(date=target_date, user=user)

        if existing_workout.exists():
            return Response({'detail': 'Workout already exists on the target date.'}, status=status.HTTP_400_BAD_REQUEST)

        new_workout = Workout.objects.create(user=user, date=target_date, notes=source_workout.notes)

        for set_group in source_workout.set_groups.all():
            new_set_group = SetGroup.objects.create(workout=new_workout, exercise=set_group.exercise, order=set_group.order)
            for set in set_group.sets.all():
                Set.objects.create(set_group=new_set_group, order=set.order, reps=set.reps, weight=set.weight)

        serializer = self.get_serializer(new_workout)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class MoveWorkoutView(generics.GenericAPIView):
    serializer_class = MoveWorkoutSerializer

    def put(self, request, *args, **kwargs):
        workout_date = self.kwargs.get('date') 
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            target_date = serializer.validated_data['target_date']
            try:
                workout = Workout.objects.get(date=workout_date)
                workout.date = target_date
                workout.save()
                return Response({'message': 'Workout moved successfully'}, status=status.HTTP_200_OK)
            except Workout.DoesNotExist:
                return Response({'error': 'Workout not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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
    
class GetWorkoutBreakdownView(generics.GenericAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user).prefetch_related(
            'set_groups__sets', 'set_groups__exercise'
        )
    

class SetRecordListView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        # Get all unique exercise names
        exercises = Exercise.objects.values_list('name', flat=True)

        record_weights = {}
        
        # Loop through each exercise to get the maximum weights for rep ranges
        for exercise in exercises:
            # Get all sets related to the current exercise
            sets = (
                Set.objects
                .filter(set_group__exercise__name=exercise)
                .values('reps')
                .annotate(max_weight=Max('weight'))
                .order_by('reps')
            )

            # Convert query result to dictionary with reps as keys
            weights_dict = {weight['reps']: weight['max_weight'] for weight in sets}
            record_weights[exercise] = weights_dict

        # Return exercises and record_weights in the required format
        return Response({
            "exercises": list(exercises),
            "record_weights": record_weights
        })