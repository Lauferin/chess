from django.db import models

class Movement(models.Model):
    player = models.BooleanField()
    piece = models.CharField("Piece", max_length=2)
    # movement = models.CharField(max_length=3)
    movement = models.CharField("Movement", max_length=2)
    promoted = models.CharField(max_length=6, null=True)

    # def __str__(self):
    #     return self

# {
# "player": true,
# "piece": "b6",
# "movement": "b4",
# "promoted": null
# }