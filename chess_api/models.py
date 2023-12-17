from django.db import models


class Game(models.Model):
    player_color = models.BooleanField("Player color", choices=[(True, 'Black'), (False, 'White')])
    opponent = models.CharField("Opponent", max_length=20, default="basic")


class Movement(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.BooleanField("Player", choices=[(True, 'Black'), (False, 'White')])
    piece = models.CharField("Piece", max_length=2)
    movement = models.CharField("Movement", max_length=2)
    promoted = models.CharField("Promoted", max_length=6, null=True)
