from .constants import KING, WHITE, BLACK


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

    def get_score(self, player, turn=True, score=None):
        return score if self.get_color() == player else -score


class Knight(Piece):
    _name = "knight"

    def get_allowed_movements(self, board, player, turn=None):
        row, col = self._row, self._col
        allowed_movements = []

        if row > 0: # one forward, two right and left
            if col < 6 and (board[row - 1][col + 2] is None or board[row - 1][col + 2].get_color() != player):
                allowed_movements.append((row - 1, col + 2))
            if col > 1 and (board[row - 1][col - 2] is None or board[row - 1][col - 2].get_color() != player):
                allowed_movements.append((row - 1, col - 2))
            if row > 1: # two forward, right and left
                if col < 7 and (board[row - 2][col + 1] is None or board[row - 2][col + 1].get_color() != player):
                    allowed_movements.append((row - 2, col + 1))
                if col > 0 and (board[row - 2][col - 1] is None or board[row - 2][col - 1].get_color() != player):
                    allowed_movements.append((row - 2, col - 1))
        if row < 7: # one backwards, two right and left
            if col < 6 and (board[row + 1][col + 2] is None or board[row + 1][col + 2].get_color() != player):
                allowed_movements.append((row + 1, col + 2))
            if col > 1 and (board[row + 1][col - 2] is None or board[row + 1][col - 2].get_color() != player):
                allowed_movements.append((row + 1, col - 2))
            if row < 6: # two backwards, right and left
                if col < 7 and (board[row + 2][col + 1] is None or board[row + 2][col + 1].get_color() != player):
                    allowed_movements.append((row + 2, col + 1))
                if col > 0 and (board[row + 2][col - 1] is None or board[row + 2][col - 1].get_color() != player):
                    allowed_movements.append((row + 2, col - 1))
        return allowed_movements

    def get_score(self, player, turn=True, score=None):
        return super().get_score(player, turn, 30)


class Bishop(Piece):
    _name = "bishop"

    def get_allowed_movements(self, board, player, turn=None):
        row, col = self._row, self._col
        allowed_movements = []
        
        i = row; j = col; # move right backwards
        while i < 7 and j < 7:
            i += 1; j += 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move right forward
        while i > 0 and j < 7:
            i -= 1; j += 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move left backwards
        while i < 7 and j > 0:
            i += 1; j -= 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move left forward
        while i > 0 and j > 0:
            i -= 1; j -= 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        return allowed_movements

    def get_score(self, player, turn=True, score=None):
        return super().get_score(player, turn, 31) # less if there in only one?


class Rook(Piece):
    _name = "rook"

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player, turn=None):
        allowed_movements = []
        row, col = self._row, self._col
        i = col; # move right
        while i < 7:
            i += 1
            if board[row][i] is None:
                allowed_movements.append((row, i))
            else:
                if board[row][i].get_color() != player:
                    allowed_movements.append((row, i))
                break
        i = col # move left
        while i > 0:
            i -= 1
            if board[row][i] is None:
                allowed_movements.append((row, i))
            else:
                if board[row][i].get_color() != player:
                    allowed_movements.append((row, i))
                break
        i = row # move backwards
        while i < 7:
            i += 1
            if board[i][col] is None:
                allowed_movements.append((i, col))
            else:
                if (board[i][col].get_color() != player):
                    allowed_movements.append((i, col))
                break
        i = row # move forward
        while (i > 0):
            i -= 1
            if board[i][col] is None:
                allowed_movements.append((i, col))
            else:
                if board[i][col].get_color() != player:
                    allowed_movements.append((i, col))
                break

        return allowed_movements

    def get_score(self, player, turn=True, score=None):
        return super().get_score(player, turn, 50)


class Queen(Piece):
    _name = "queen"

    def get_allowed_movements(self, board, player, turn=None):
        row, col = self._row, self._col
        allowed_movements = []
        
        # bishop movements
        i = row; j = col; # move right backwards
        while i < 7 and j < 7:
            i += 1; j += 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move right forward
        while i > 0 and j < 7:
            i -= 1; j += 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move left backwards
        while i < 7 and j > 0:
            i += 1; j -= 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break
        i = row; j = col; # move left forward
        while i > 0 and j > 0:
            i -= 1; j -= 1
            if board[i][j] is None:
                allowed_movements.append((i, j))
            else:
                if board[i][j].get_color() != player:
                    allowed_movements.append((i, j))
                break

        # rook movements
        i = col; # move right
        while i < 7:
            i += 1
            if board[row][i] is None:
                allowed_movements.append((row, i))
            else:
                if board[row][i].get_color() != player:
                    allowed_movements.append((row, i))
                break
        i = col # move left
        while i > 0:
            i -= 1
            if board[row][i] is None:
                allowed_movements.append((row, i))
            else:
                if board[row][i].get_color() != player:
                    allowed_movements.append((row, i))
                break
        i = row # move backwards
        while i < 7:
            i += 1
            if board[i][col] is None:
                allowed_movements.append((i, col))
            else:
                if (board[i][col].get_color() != player):
                    allowed_movements.append((i, col))
                break
        i = row # move forward
        while (i > 0):
            i -= 1
            if board[i][col] is None:
                allowed_movements.append((i, col))
            else:
                if board[i][col].get_color() != player:
                    allowed_movements.append((i, col))
                break

        return allowed_movements

    def get_score(self, player, turn=True, score=None):
        return super().get_score(player, turn, 90)


class Pawn(Piece):
    _name = "pawn"

    promotions = [Knight, Bishop, Rook, Queen]

    def __init__(self, color):
        super().__init__(color)
        self._passant = False

    # def move(self, times=1, direction="ahead"):
    #     call super for seeing if there is a check mate? or what happens with the king?
    #     if self._row < 7 and board[]

    def get_allowed_movements(self, board, player, turn=True):
        row, col = self._row, self._col
        allowed_movements = []
        forward = 1 if turn else -1
        initialPosition = 1 if turn else 6
        promotionPosition = 6 if turn else 1
        if row == promotionPosition:
            if board[row + forward][col] is None:
                allowed_movements.extend([(row + forward, col, promotion) for promotion in self.promotions])
        elif board[row + forward][col] is None:
            allowed_movements.append((row + forward, col))
            if row == initialPosition and board[row + 2 * forward][col] is None:
                allowed_movements.append((row + 2 * forward, col))
        if col > 0 and board[row + forward][col - 1] is not None and board[row + forward][col - 1].get_color() != player:
            if row == promotionPosition:
                allowed_movements.extend([(row + forward, col - 1, promotion) for promotion in self.promotions])
            else:
                allowed_movements.append((row + forward, col - 1))
        if col < 7 and board[row + forward][col + 1] is not None and board[row + forward][col + 1].get_color() != player:
            if row == promotionPosition:
                allowed_movements.extend([(row + forward, col + 1, promotion) for promotion in self.promotions])
            else:
                allowed_movements.append((row + forward, col + 1))
        # add rule of crazy pawn

        return allowed_movements
    
    def get_score(self, player, turn=True, score=None):
        score = 9
        row, _ = self.get_position()
        squares_forward = row if player is self.get_color() else 7 - row
        score += squares_forward * 1
        return super().get_score(player, turn, score)


class King(Piece):
    _name = KING

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player, turn=None):
        row, col = self._row, self._col
        allowed_movements = []

        if col > 0:
            if row > 0 and self.is_free_or_opponent(board, player, row - 1, col - 1):
                allowed_movements.append((row - 1, col - 1))
            if row < 7 and self.is_free_or_opponent(board, player, row + 1, col - 1):
                allowed_movements.append((row + 1, col - 1))
            if self.is_free_or_opponent(board, player, row, col - 1):
                allowed_movements.append((row, col - 1))
        if col < 7:
            if row > 0 and self.is_free_or_opponent(board, player, row - 1, col + 1):
                allowed_movements.append((row - 1, col + 1))
            if row < 7 and self.is_free_or_opponent(board, player, row + 1, col + 1):
                allowed_movements.append((row + 1, col + 1))
            if self.is_free_or_opponent(board, player, row, col + 1):
                allowed_movements.append((row, col + 1))
        if row > 0 and self.is_free_or_opponent(board, player, row - 1, col):
            allowed_movements.append((row - 1, col))
        if row < 7 and self.is_free_or_opponent(board, player, row + 1, col):
            allowed_movements.append((row + 1, col))

        return allowed_movements

    def is_free_or_opponent(self, board, player, row, col):
        return board[row][col] is None or board[row][col].get_color() != player

    def get_score(self, player, turn=True, score=None):
        return 0
