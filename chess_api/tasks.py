from celery import shared_task
from time import sleep
from .models import Movement, Game
from .pieces import Rook, Knight, Bishop, King, Queen, Pawn
from .util import parse, unParse
from .constants import WHITE, BLACK
import random

@shared_task
def process_movement_async(movement_id=None, game_id=None):
    print("SCRUPUS")
    # Simulate some asynchronous processing
    sleep(1)  # Replace with your actual asynchronous processing logic
    player = None
    movements_array = []

    # from celery.contrib import rdb;rdb.set_trace()

    if movement_id != None:
        game = Movement.objects.get(pk=movement_id).game
        game_id = game.id
        player = BLACK if Movement.objects.get(pk=movement_id).player == True else WHITE # if the user is white (true), we're black
        game_movements = Movement.objects.filter(game=game_id) # simplify this afterwards
        movements_array = [(movement.piece, movement.movement) for movement in game_movements]
        print(movements_array)
    else: # we received game_id
        player = WHITE
        game = Game.objects.get(pk=game_id)

    board = [
        [Rook(BLACK), Knight(BLACK), Bishop(BLACK), King(BLACK), Queen(BLACK), Bishop(BLACK), Knight(BLACK), Rook(BLACK)],
        [Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK)],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE)],
        [Rook(WHITE), Knight(WHITE), Bishop(WHITE), King(WHITE), Queen(WHITE), Bishop(WHITE), Knight(WHITE), Rook(WHITE)],
    ]
    pieces = []
    for row_index, row in enumerate(board):
        for col_index, piece in enumerate(row):
            if piece is not None:
                piece.change_position(row_index, col_index)
                pieces.append(piece) 

    # from celery.contrib import rdb;rdb.set_trace()
    for movement in movements_array:
        pieceColumn, pieceRow = unParse(movement[0], player)
        movementColumn, movementRow = unParse(movement[1], player)
        if board[movementRow][movementColumn] is not None:
            pieces = [piece for piece in pieces if piece.get_position() != (movementRow, movementColumn)]
        board[movementRow][movementColumn] = board[pieceRow][pieceColumn]
        board[movementRow][movementColumn].change_position(movementRow, movementColumn)
        board[pieceRow][pieceColumn] = None

    board_state = [[piece.get_name() if piece is not None else "" for piece in row] for row in board]
    print(board_state)
    print("total pieces: ", len(pieces))

 
    allowed_movements = []
    player_pieces = [piece for piece in pieces if piece.get_color() == player]
    for piece in player_pieces:
        allowed_movements += [(parse(*piece.get_position(), player), parse(*movement, player)) # * unpacks from tuple
                            for movement in piece.get_allowed_movements(board, player)] 

    print(allowed_movements)
    selected_movement = random.choice(allowed_movements)
    print(selected_movement)


    # if not game is over
    new_movement = Movement.objects.create(
        game=game,
        player=player,
        piece=selected_movement[0],
        movement=selected_movement[1],
        promoted=None
    )
    # where does this go?
    return new_movement.id