from celery import shared_task
from .models import Movement, Game
from .pieces import Rook, Knight, Bishop, King, Queen, Pawn
from .util import unParse
from .constants import WHITE, BLACK, KING
from .movements import get_movement

@shared_task
def process_movement_async(movement_id=None, game_id=None):
    # time.sleep(1)
    player = None
    movements_array = []

    if movement_id != None:
        game = Movement.objects.get(pk=movement_id).game
        game_id = game.id
        player = BLACK if Movement.objects.get(pk=movement_id).player == True else WHITE # if the user is white (true), we're black
        game_movements = Movement.objects.filter(game=game_id) # simplify this afterwards
        movements_array = [
            {"piece": movement.piece, "movement": movement.movement, "promoted": movement.promoted, "player": movement.player} 
            for movement in game_movements
        ]
    else: # we received game_id
        player = WHITE
        game = Game.objects.get(pk=game_id)
    opponent = BLACK if player == WHITE else WHITE

    promotion_pieces = {
        "knight": Knight,
        "bishop": Bishop,
        "rook": Rook,
        "queen": Queen
    }

    board = [
        [Rook(player), Knight(player), Bishop(player), King(player), Queen(player), Bishop(player), Knight(player), Rook(player)],
        [Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player), Pawn(player)],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent), Pawn(opponent)],
        [Rook(opponent), Knight(opponent), Bishop(opponent), King(opponent), Queen(opponent), Bishop(opponent), Knight(opponent), Rook(opponent)],
    ]
    pieces = []
    for row_index, row in enumerate(board):
        for col_index, piece in enumerate(row):
            if piece is not None:
                piece.change_position(row_index, col_index)
                pieces.append(piece) 

    # from celery.contrib import rdb;rdb.set_trace()
    for movement in movements_array:
        piece_column, piece_row = unParse(movement["piece"], player)
        movement_column, movement_row = unParse(movement["movement"], player)
        if board[movement_row][movement_column] is not None:
            pieces = [piece for piece in pieces if piece.get_position() != (movement_row, movement_column)]
        board[movement_row][movement_column] = board[piece_row][piece_column]
        board[movement_row][movement_column].change_position(movement_row, movement_column)
        board[piece_row][piece_column] = None

        if isCastling(board, movement_row, movement_column, piece_column):
            # from celery.contrib import rdb;rdb.set_trace()
            rook_column = 0 if movement_column < piece_column else 7
            movement_direction = 1 if movement_column < piece_column else -1
            board[movement_row][movement_column + movement_direction] = board[piece_row][rook_column]
            board[movement_row][movement_column + movement_direction].change_position(movement_row, movement_column + movement_direction)
            board[piece_row][rook_column] = None
        if movement["promoted"] != None:
            board[movement_row][movement_column] = promotion_pieces[movement["promoted"]](movement["player"])
            board[movement_row][movement_column].change_position(movement_row, movement_column)
            pieces = [piece for piece in pieces if piece.get_position() != (movement_row, movement_column)]
            pieces.append(board[movement_row][movement_column])

    # from celery.contrib import rdb;rdb.set_trace()
    selected_movement = get_movement(board, pieces, player, game.opponent)

    if selected_movement["state"] == "ok": # game not over
        new_movement = Movement.objects.create(
            game=game,
            player=player,
            piece=selected_movement["piece"],
            movement=selected_movement["movement"],
            promoted=selected_movement["promoted"]
        )
        return new_movement.id

    return -1


def isCastling(board, movement_row, movement_column, piece_column):
    if board[movement_row][movement_column].get_name() == KING and abs(movement_column - piece_column) == 2:
        return True
    return False
