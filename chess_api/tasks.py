from celery import shared_task
from time import sleep
from .models import Movement
from .pieces import Rook, Knight, Bishop, King, Queen, Pawn
from .util import parse, unParse
import random

@shared_task
def process_movement_async(movement_id):
    print("SCRUPUS")
    # Simulate some asynchronous processing
    sleep(1)  # Replace with your actual asynchronous processing logic
    BLACK = "black"
    WHITE = "white"
    player = BLACK
    opponent = BLACK if player == "white" else WHITE
    last_movement = Movement.objects.get(pk=movement_id)
    game_movements = Movement.objects.filter(game=last_movement.game) # simplify this afterwards
    # print(movement.game)
    movements_array = [(movement.piece, movement.movement) for movement in game_movements]
    print(movements_array)
    board = [
        [Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent)],
        [Rook(opponent), Knight(opponent), Bishop(opponent), King(opponent), Queen(opponent), Bishop(opponent), Knight(opponent), Rook(opponent)],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [Rook(player), Knight(player), Bishop(player), King(player), Queen(player), Bishop(player), Knight(player), Rook(player)],
        [Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player)],
    ]
    pieces = []
    for row_index, row in enumerate(board):
        for col_index, piece in enumerate(row):
            if piece is not None:
                piece.change_position(parse(row_index, col_index, player))
                pieces.append(piece) 

    # from celery.contrib import rdb;rdb.set_trace()
    for movement in movements_array:
        pieceColumn, pieceRow = unParse(movement[0], player)
        movementColumn, movementRow = unParse(movement[1], player)
        if board[movementRow][movementColumn] is None:
            pieces = [piece for piece in pieces if piece.get_position() != movement[1]]
        board[movementRow][movementColumn] = board[pieceRow][pieceColumn]
        board[movementRow][movementColumn].change_position(movement[1])
        board[pieceRow][pieceColumn] = None

    board_state = [[piece.get_name() if piece is not None else "" for piece in row] for row in board]
    print(board_state)
    print("total pieces: ", len(pieces))

 
    allowed_movements = []
    player_pieces = [piece for piece in pieces if piece.get_color() == player]
    for piece in player_pieces:
        allowed_movements += [(piece.get_position(), movement) for movement in piece.get_allowed_movements(board)]

    print(allowed_movements)
    selected_movement = random.choice(allowed_movements)

    # if not game is over
    new_movement = Movement.objects.create(
        game=last_movement.game,
        player=False,
        piece=selected_movement[0],
        movement=selected_movement[1],
        promoted=last_movement.promoted
    )
    # where does this go?
    return new_movement.id