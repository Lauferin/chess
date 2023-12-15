from operator import ge
from webbrowser import get

from .constants import BLACK, KING, WHITE
from .util import isCastling, parse
from copy import deepcopy
# from .pieces import Knight, Bishop, Rook, Queen
import random


# promotion_pieces = {
#     "knight": Knight,
#     "bishop": Bishop,
#     "rook": Rook,
#     "queen": Queen
# }

class Game(object):

    def __init__(self, board=None, pieces=None, player_permanent=None, player=None):
        self.board = board
        self.pieces = pieces
        self.player = player
        self.player_permanent = player_permanent

    def get_score(self):
        return sum(piece.get_score(self.player_permanent) for piece in self.pieces)

    def generate_successor(self, movement):
        board = deepcopy(self.board)
        movement_row = movement[1][0]
        movement_column = movement[1][1]
        piece_row = movement[0][0]
        piece_column = movement[0][1]
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
        # if movement["promoted"] != None:
        #     board[movement_row][movement_column] = promotion_pieces[movement[1][2]](movement["player"])
        #     board[movement_row][movement_column].change_position(movement_row, movement_column)

        pieces = []
        for row_index, row in enumerate(board):
            for col_index, piece in enumerate(row):
                if piece is not None:
                    piece.change_position(row_index, col_index, moved=False)
                    pieces.append(piece) 
        
        return Game(board=board, pieces=pieces, player_permanent=self.player_permanent, player=not self.player)

    def get_allowed_movements(self, turn=True):
        movements = get_turn_allowed_movements(self.board, self.pieces, self.player, turn=turn)
        movements_without_check = []
        for movement in movements:
            piece_row = movement[0][0]
            piece_col = movement[0][1]
            movement_row = movement[1][0]
            movement_col = movement[1][1]
            board = deepcopy(self.board)
            # make pieces from scratch, since we deep-copied the board, and we want to be able to compair with it
            board[movement_row][movement_col] = board[piece_row][piece_col]
            board[movement_row][movement_col].change_position(movement_row, movement_col)
            board[piece_row][piece_col] = None
            pieces = [piece for row in board for piece in row if piece is not None]
            king = [piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == self.player][0]
            opponentMovements = get_turn_allowed_movements(board, pieces, not self.player, turn=not turn)
            if king.get_position() not in [(movement[1][0], movement[1][1]) for movement in opponentMovements]: # not just movement(1) because of promotions
                movements_without_check.append(movement)
        return movements_without_check

    def get_best_movement(self, depth):

        def maxValue(state, depth, alpha, beta):
            if depth == 0: # stop condition of the recursion
                return state.get_score(), None
            allowed_movements = state.get_allowed_movements()
            if len(allowed_movements) == 0: # we don't do this with the depth so it doesn't calculate them unnecessarily
                return 0, None # WE SHOULD CHECK HERE WHETHER IT'S DRAWN (0) OR CHECKMATE (999999)
            depth -= 1
            v = -999999

            for movement in allowed_movements:
                successor = state.generate_successor(movement)
                v2, _ = minValue(successor, depth, alpha, beta)
                if v2 > v:
                    v, move = v2, movement
                    alpha = max(alpha, v)
                if v > beta:
                    return v, move
            return v, move

        def minValue(state, depth, alpha, beta):
            allowed_movements = state.get_allowed_movements(turn=False)
            if len(allowed_movements) == 0:
                return 0, None # WE SHOULD CHECK HERE WHETHER IT'S DRAWN (0) OR CHECKMATE (-999999)
            v = 999999

            for movement in allowed_movements:
                successor = state.generate_successor(movement)
                v2, _ = maxValue(successor, depth, alpha, beta)
                if v2 < v:
                    v = v2
                    beta = min(beta, v)
                if v < alpha:
                    return v, _
            return v, _

        # from celery.contrib import rdb;rdb.set_trace()
        _ , move = maxValue(self, depth, -999999, 999999)

        return move


def move(board, selected, player, state):
    if state == True:
        return {"piece": None, "movement": None, "promoted": None, "state": get_state(board, player)}
    formatted_movement = {
        "piece": parse(selected[0][0], selected[0][1], player), 
        "movement": parse(selected[1][0], selected[1][1], player), 
        "promoted": selected[1][2](player).get_name() if len(selected[1]) == 3 else None
    }
    movement_object = {**formatted_movement, "state": "ok"}

    return movement_object


def get_state(board, player): # not really doing anything with this yet
    pieces = [piece for row in board for piece in row if piece is not None]
    king = [piece for piece in pieces if piece is not None and piece.get_name() == KING and piece.get_color() == player][0]
    opponent = BLACK if player == WHITE else WHITE
    opponentMovements = get_turn_allowed_movements(board, pieces, opponent, False)
    if king.get_position() in [movement[1] for movement in opponentMovements]:
        return "checkmate"
    return "drawn"


def get_turn_allowed_movements(board, pieces, player, check_castling=True, turn=True):
    allowed_movements = []
    player_pieces = [piece for piece in pieces if piece.get_color() == player]
    for piece in player_pieces:
        allowed_movements += [(piece.get_position(), movement) for movement in piece.get_allowed_movements(board, pieces, player, check_castling, turn=turn)]
    return allowed_movements


def get_movement(board, pieces, player, algorithm):
    
    def basic():
        state = Game(board=board, pieces=pieces, player=player, player_permanent=player)
        allowed_movements = state.get_allowed_movements()
        if len(allowed_movements) == 0:
            return move(board, None, player, True)
        selected = random.choice(allowed_movements)
        return move(None, selected, player, False)

    def beginner():
        state = Game(board=board, pieces=pieces, player=player, player_permanent=player)
        allowed_movements = state.get_allowed_movements()
        if len(allowed_movements) == 0:
            return move(board, None, player, True)
        best_score = max([state.generate_successor(movement).get_score() for movement in allowed_movements])
        best_movements = [movement for movement in allowed_movements if state.generate_successor(movement).get_score() == best_score]
        selected = random.choice(best_movements)
        return move(None, selected, player, False)

    def intermediate():
        state = Game(board=board, pieces=pieces, player=player, player_permanent=player)
        movement = state.get_best_movement(depth=1)
        return move(None, movement, player, False)

    def advanced():
        state = Game(board=board, pieces=pieces, player=player, player_permanent=player)
        movement = state.get_best_movement(depth=2)
        return move(None, movement, player, False)

    algorithms = {
        "basic": basic,
        "beginner": beginner,
        "intermediate": intermediate,
        "advanced": advanced,
    }

    return algorithms.get(algorithm, basic)()
