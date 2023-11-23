from rest_framework import serializers
from .models import Game, Movement


class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = ('pk', 'player_color')


class MovementSerializer(serializers.ModelSerializer):
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all())

    class Meta:
        model = Movement
        fields = ('pk', 'game', 'player', 'piece', 'movement', 'promoted')
        
    # def create(self, validated_data):
    #     print(validated_data)
    #     game_data = validated_data.pop('game')
        
    #     # Check if the Game instance with the specified pk exists
    #     try:
    #         game_instance = Game.objects.get(pk=game_data)
    #     except Game.DoesNotExist:
    #         raise serializers.ValidationError("Invalid Game pk. Game does not exist.")

    #     # Create the Movement instance with the existing Game reference
    #     movement_instance = Movement.objects.create(game=game_instance, **validated_data)
    #     return movement_instance
