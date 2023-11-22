from celery import shared_task
from time import sleep
from .models import Movement

@shared_task
def process_movement_async(movement_id):
    print("SCRUPUS")
    # Simulate some asynchronous processing
    sleep(1)  # Replace with your actual asynchronous processing logic

    # Add a new movement or perform other actions after asynchronous processing
    movement = Movement.objects.get(pk=movement_id)
    # Perform additional operations or save a new movement if needed
    new_movement = Movement.objects.create(
        game=movement.game,
        player=False,
        piece="g7",
        movement="g5",
        promoted=movement.promoted
    )
    return new_movement.id