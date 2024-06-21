from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    weight = models.FloatField(null=True, blank=True)
    body_fat_percentage = models.FloatField(null=True, blank=True)
    preferred_unit = models.CharField(max_length=3, choices=[('kg', 'Kilograms'), ('lbs', 'Pounds')], default='kg')

class Workout(models.Model):
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")

    class Meta:
        unique_together = ('date', 'user')

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    muscle_group = models.CharField(max_length=100, null=True)

class SetGroup(models.Model):
    workout = models.ForeignKey(Workout, related_name="set_groups", on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, related_name="sets", on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('workout', 'order')
        ordering = ['order']

class Set(models.Model):
    set_group = models.ForeignKey(SetGroup, related_name="sets", on_delete=models.CASCADE, null=True)
    order = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField()

    class Meta:
        unique_together = ('set_group', 'order')
        ordering = ['order']
