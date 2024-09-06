from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404
from django.db import transaction, IntegrityError
from ..models import SetGroup, Set, Workout
from ..serializers import SetGroupSerializer, SetSerializer

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

class UpdateSetOrderView(generics.UpdateAPIView):
    def put(self, request, *args, **kwargs):
        set_group_id = kwargs['set_group_id']
        sets_data = request.data.get('sets', [])

        try:
            with transaction.atomic():
                for set_data in sets_data:
                    set_id = set_data['id']
                    temp_order = set_data['order'] + 1000
                    Set.objects.filter(id=set_id, set_group_id=set_group_id).update(order=temp_order)

                for set_data in sets_data:
                    set_id = set_data['id']
                    final_order = set_data['order']
                    Set.objects.filter(id=set_id, set_group_id=set_group_id).update(order=final_order)

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except IntegrityError as e:
            return Response({"error": "Database error: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateSetGroupOrderView(generics.UpdateAPIView):
    def put(self, request, *args, **kwargs):
        workout_date = self.kwargs.get('date')
        set_groups_data = request.data.get('setGroups', [])

        try:
            workout = Workout.objects.get(date=workout_date, user=self.request.user)

            with transaction.atomic():
                for set_group_data in set_groups_data:
                    set_group_id = set_group_data['id']
                    temp_order = set_group_data['order'] + 1000
                    SetGroup.objects.filter(id=set_group_id, workout=workout).update(order=temp_order)

                for set_group_data in set_groups_data:
                    set_group_id = set_group_data['id']
                    final_order = set_group_data['order']
                    SetGroup.objects.filter(id=set_group_id, workout=workout).update(order=final_order)

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except Workout.DoesNotExist:
            return Response({"error": "Workout not found"}, status=status.HTTP_404_NOT_FOUND)
        except IntegrityError as e:
            return Response({"error": "Database error: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SetGroupDestroyView(generics.DestroyAPIView):
    queryset = SetGroup.objects.all()
    serializer_class = SetGroupSerializer
    permission_classes = [IsAuthenticated]
