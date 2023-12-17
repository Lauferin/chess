from rest_framework import serializers
from .models import Game, Movement


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('pk', 'player_color', 'opponent')


class MovementSerializer(serializers.ModelSerializer):
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all())

    class Meta:
        model = Movement
        fields = ('pk', 'game', 'player', 'piece', 'movement', 'promoted')
