from datetime import datetime
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404
from ..models import Workout, SetGroup, Set
from ..serializers import WorkoutSerializer, MoveWorkoutSerializer


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
        user = self.request.user
        workout_date = self.kwargs.get('date') 
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            target_date = serializer.validated_data['target_date']
            try:
                workout = Workout.objects.get(date=workout_date, user=user)
                workout.date = target_date
                workout.save()
                return Response({'message': 'Workout moved successfully'}, status=status.HTTP_200_OK)
            except Workout.DoesNotExist:
                return Response({'error': 'Workout not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
