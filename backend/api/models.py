from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    weight = models.FloatField(null=True, blank=True)
    body_fat_percentage = models.FloatField(null=True, blank=True)

class Workout(models.Model):
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)

class Exercise(models.Model):
    name = models.CharField(max_length=100)

class Set(models.Model):
    workout = models.ForeignKey(Workout, related_name="sets", on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, related_name="sets", on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField()

    class Meta:
        unique_together = ('workout', 'exercise', 'order')
        ordering = ['order']
