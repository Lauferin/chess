from django.db import models


class Game(models.Model):
    pass
    # def __str__(self):
    #     return self.pk


class Movement(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.BooleanField("Player", choices=[(True, 'Black'), (False, 'White')])
    piece = models.CharField("Piece", max_length=2)
    movement = models.CharField("Movement", max_length=2)
    promoted = models.CharField("Promoted", max_length=6, null=True)


# {
# "game": 2,
# "player": true,
# "piece": "b6",
# "movement": "b4",
# "promoted": null
# }
