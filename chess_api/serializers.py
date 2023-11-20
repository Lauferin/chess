from rest_framework import serializers
from .models import Movement

class MovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movement 
        fields = ('pk', 'player', 'piece', 'movement', 'promoted')
        