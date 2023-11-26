from .constants import WHITE, BLACK


class Piece(object):

    def __init__(self, color):
        self._color = color
    
    def get_name(self):
        return self._name
    
    def get_position(self):
        return self._row, self._col

    def change_position(self, row, col):
        self._row = row
        self._col = col

    def get_color(self):
        return self._color


class Pawn(Piece):
    _name = "Pawn"

    promotions = ["knight", "bishop", "rook", "queen"]

    def __init__(self, color):
        super().__init__(color)
        self._passant = False

    # def move(self, times=1, direction="ahead"):
    #     call super for seeing if there is a check mate? or what happens with the king?
    #     if self._row < 7 and board[]

    def get_allowed_movements(self, board, player):
        row, col = self._row, self._col
        allowed_movements = []
        if row == 6:
            if board[row + 1][col] == None:
                allowed_movements.extend([(row + 1, col, promotion) for promotion in self.promotions])
        elif board[row + 1][col] == None:
            allowed_movements.append((row + 1, col))
            if row == 1 and board[row + 2][col] == None:
                allowed_movements.append((row + 2, col))
        if col > 0 and board[row + 1][col - 1] is not None and board[row + 1][col - 1].get_color() != player:
            if row == 6:
                allowed_movements.extend([(row + 1, col - 1, promotion) for promotion in self.promotions])
            else:
                allowed_movements.append((row + 1, col - 1))
        if col < 7 and board[row + 1][col + 1] is not None and board[row + 1][col + 1].get_color() != player:
            if row == 6:
                allowed_movements.extend([(row + 1, col + 1, promotion) for promotion in self.promotions])
            else:
                allowed_movements.append((row + 1, col + 1))
        # add rule of crazy pawn

        return allowed_movements


class Knight(Piece):
    _name = "Knight"

    def get_allowed_movements(self, board, player):
        row, col = self._row, self._col
        allowed_movements = []

        if row > 0: # one forward, two right and left
            if col < 6 and (board[row - 1][col + 2] is None or board[row - 1][col + 1].get_color() != player):
                allowed_movements.append([row - 1, col + 2])
            if col > 1 and (board[row - 1][col - 1] is None or board[row - 1][col - 1].get_color() != player):
                allowed_movements.append([row - 1, col - 2])
            if row > 1: # two forward, right and left
                if col < 7 and (board[row - 2][col + 1] is None or board[row - 2][col + 1].get_color() != player):
                    allowed_movements.append([row - 2, col + 1])
                if col > 0 and (board[row - 2][col - 1] is None or board[row - 2][col - 1].get_color() != player):
                    allowed_movements.append([row - 2, col - 1])
        if row < 7: # one backwards, two right and left
            if col < 6 and (board[row + 1][col + 2] is None or board[row + 1][col + 2].get_color() != player):
                allowed_movements.append([row + 1, col + 2])
            if col > 1 and (board[row + 1][col - 2] is None or board[row + 1][col - 2].get_color() != player):
                allowed_movements.append([row + 1, col - 2])
            if row < 6: # two backwards, right and left
                if col < 7 and (board[row + 2][col + 1] is None or board[row + 2][col + 1].get_color() != player):
                    allowed_movements.append([row + 2, col + 1])
                if col > 0 and (board[row + 2][col - 1] is None or board[row + 2][col - 1].get_color() != player):
                    allowed_movements.append([row + 2, col - 1])
        return allowed_movements


class Bishop(Piece):
    _name = "Bishop"

    def get_allowed_movements(self, board, player):
        return [(2, 2), (2, 3), (2, 4)]


class Rook(Piece):
    _name = "Rook"

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player):
        return [(2, 2), (2, 3), (2, 4)]


class Queen(Piece):
    _name = "Queen"

    def get_allowed_movements(self, board, player):
        return [(2, 2), (2, 3), (2, 4)]


class King(Piece):
    _name = "King"

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player):
        return [(2, 2), (2, 3), (2, 4)]
