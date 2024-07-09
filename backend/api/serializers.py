from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile, Exercise, Set, SetGroup, Workout

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'weight', 'body_fat_percentage', 'preferred_unit']

class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "userprofile"]
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
    
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name']

class SetSerializer(serializers.ModelSerializer):
    display_weight = serializers.SerializerMethodField()

    def get_display_weight(self, obj):
        request = self.context.get('request')
        preferred_unit = request.user.profile.preferred_unit if request else 'kg'
        if preferred_unit == 'lbs':
            lbs = obj.weight * 2.20462
            return round(lbs, 1)  # Convert kg to lbs
        return obj.weight
    
    def validate_weight(self, value):
        request = self.context.get('request')
        preferred_unit = request.user.profile.preferred_unit if request else 'kg'
        if preferred_unit == 'lbs':
            lbs = value / 2.20462
            return round(lbs, 2)  # Convert kg to lbs
        return value

    class Meta:
        model = Set
        fields = ['id', 'order', 'reps', 'weight', "display_weight"]

class SetGroupSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, read_only=True)
    exercise_name = serializers.ReadOnlyField(source='exercise.name')
    muscle_group = serializers.CharField(source='exercise.muscle_group', read_only=True)

    class Meta:
        model = SetGroup
        fields = ['id', 'workout', 'exercise', 'exercise_name', 'muscle_group', 'order', 'sets']

class WorkoutSerializer(serializers.ModelSerializer):
    set_groups = SetGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'date', 'notes', 'set_groups']

class MoveWorkoutSerializer(serializers.Serializer):
    target_date = serializers.DateField()