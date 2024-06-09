from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, WorkoutSerializer, SetSerializer, SetGroupSerializer, ExerciseSerializer
from .models import User, Workout, Set, SetGroup, Exercise
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.http import Http404

User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class WorkoutListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
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