from operator import ge
from webbrowser import get

from .constants import BLACK, KING, WHITE
from .util import parse
from copy import deepcopy
import random


def move(selected, player):
    formatted_movement = {
        "piece": parse(selected[0][0], selected[0][1], player), 
        "movement": parse(selected[1][0], selected[1][1], player), 
        "promoted": selected[1][2] if len(selected[1]) == 3 else None
    }
    movement_object = {**formatted_movement, "state": "ok"} # state can be checkmate or others

    return movement_object


def get_turn_allowed_movements(board, pieces, player, turn=True):
    allowed_movements = []
    player_pieces = [piece for piece in pieces if piece.get_color() == player]
    for piece in player_pieces:
        # allowed_movements += [(parse(*piece.get_position(), player), parse(movement[0], movement[1], player), movement[2]) if len(movement) == 3
        #                  else (parse(*piece.get_position(), player), parse(movement[0], movement[1], player))
        #                  for movement in piece.get_allowed_movements(board, player, turn=True)]
        allowed_movements += [(piece.get_position(), movement) for movement in piece.get_allowed_movements(board, player, turn=turn)]
    return allowed_movements


def get_allowed_movements(board, pieces, player):
    movements = get_turn_allowed_movements(board, pieces, player)
    opponent = BLACK if player == WHITE else WHITE
    print("movements: ", movements)
    print("mov1: ", len(movements))
    movements_without_check = []
    # from celery.contrib import rdb;rdb.set_trace()
    for movement in movements:
        piece_row = movement[0][0]
        piece_col = movement[0][1]
        movement_row = movement[1][0]
        movement_col = movement[1][1]
        print(((piece_row, piece_col), (movement_row, movement_col)))
        new_board = deepcopy(board)

        # new_pieces = [piece for piece in pieces if piece.get_position() != (movement_row, movement_col)]
        pieces = [piece for row in new_board for piece in row if piece is not None and piece.get_position() != (movement_row, movement_col)]


        new_board[movement_row][movement_col] = new_board[piece_row][piece_col]
        new_board[movement_row][movement_col].change_position(movement_row, movement_col)
        new_board[piece_row][piece_col] = None
        print("length king", len([piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == player]))
        king = [piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == player][0]
        print("king", king.get_position())
        print("pieces length", len(pieces))
        opponentMovements = get_turn_allowed_movements(new_board, pieces, opponent, False)
        print(king.get_position() not in [movement[1] for movement in opponentMovements])
        print("opponent", opponentMovements)
        if king.get_position() not in [movement[1] for movement in opponentMovements]:
            movements_without_check.append(movement)
    # ESTAN DESAPARECIENDO LAS PIEZAS EN PIECES PARECE
    print("mov2: ", len(movements_without_check))

    return movements_without_check


def get_movement(board, pieces, player, algorithm):
    
    def basic():

        allowed_movements = get_allowed_movements(board, pieces, player)
        # print(allowed_movements)
        selected = random.choice(allowed_movements)
        # from celery.contrib import rdb;rdb.set_trace()

        return move(selected, player)


    def basic2():
        return "This is case 2"


    def basic3():
        return "This is case 3"


    algorithms = {
        "basic2": basic2,
        "basic3": basic3
    }

    return algorithms.get(algorithm, basic)()
