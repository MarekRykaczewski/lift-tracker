from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile, Exercise, Set, SetGroup, Workout

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'weight', 'body_fat_percentage']
    
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name']


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'order', 'reps', 'weight']

class SetGroupSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, read_only=True)
    exercise_name = serializers.ReadOnlyField(source='exercise.name')

    class Meta:
        model = SetGroup
        fields = ['id', 'workout', 'exercise_name', 'order', 'sets']

class WorkoutSerializer(serializers.ModelSerializer):
    set_groups = SetGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'date', 'notes', 'set_groups']