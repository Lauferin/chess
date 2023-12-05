from operator import ge
from webbrowser import get

from .constants import BLACK, KING, WHITE
from .util import parse
from copy import deepcopy
import random


def move(board, selected, player, state):
    if state == True:
        return {"piece": None, "movement": None, "promoted": None, "state": get_state(board, player)}
    formatted_movement = {
        "piece": parse(selected[0][0], selected[0][1], player), 
        "movement": parse(selected[1][0], selected[1][1], player), 
        "promoted": selected[1][2] if len(selected[1]) == 3 else None
    }
    movement_object = {**formatted_movement, "state": "ok"}

    return movement_object


def get_state(board, player): # not really doing anything with this info yet
    pieces = [piece for row in board for piece in row if piece is not None]
    king = [piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == player][0]
    opponent = BLACK if player == WHITE else WHITE
    opponentMovements = get_turn_allowed_movements(board, pieces, opponent, False)
    if king.get_position() in [movement[1] for movement in opponentMovements]:
        return "checkmate"
    return "drawn"


def get_turn_allowed_movements(board, pieces, player, turn=True):
    allowed_movements = []
    player_pieces = [piece for piece in pieces if piece.get_color() == player]
    for piece in player_pieces:
        allowed_movements += [(piece.get_position(), movement) for movement in piece.get_allowed_movements(board, player, turn=turn)]
    return allowed_movements


def get_allowed_movements(board, pieces, player):
    movements = get_turn_allowed_movements(board, pieces, player)
    opponent = BLACK if player == WHITE else WHITE
    movements_without_check = []
    for movement in movements:
        piece_row = movement[0][0]
        piece_col = movement[0][1]
        movement_row = movement[1][0]
        movement_col = movement[1][1]
        new_board = deepcopy(board)
        # make pieces from scratch, since we deep-copied the board, and we want to be able to compair with it
        pieces = [piece for row in new_board for piece in row if piece is not None and piece.get_position() != (movement_row, movement_col)]
        new_board[movement_row][movement_col] = new_board[piece_row][piece_col]
        new_board[movement_row][movement_col].change_position(movement_row, movement_col)
        new_board[piece_row][piece_col] = None
        king = [piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == player][0]
        opponentMovements = get_turn_allowed_movements(new_board, pieces, opponent, False)
        if king.get_position() not in [(movement[1][0], movement[1][1]) for movement in opponentMovements]: # not just movement(1) because of promotions
            movements_without_check.append(movement)

    return movements_without_check


def get_movement(board, pieces, player, algorithm):
    
    def basic():

        allowed_movements = get_allowed_movements(board, pieces, player)
        if len(allowed_movements) == 0:
            return move(board, None, player, True)
        selected = random.choice(allowed_movements)
        return move(None, selected, player, False)


    def basic2():
        return "This is case 2"


    def basic3():
        return "This is case 3"


    algorithms = {
        "basic2": basic2,
        "basic3": basic3
    }

    return algorithms.get(algorithm, basic)()
