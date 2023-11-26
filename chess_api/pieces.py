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
            if board[row + 1][col] is None:
                allowed_movements.extend([(row + 1, col, promotion) for promotion in self.promotions])
        elif board[row + 1][col] is None:
            allowed_movements.append((row + 1, col))
            if row == 1 and board[row + 2][col] is None:
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


class Bishop(Piece):
    _name = "Bishop"

    def get_allowed_movements(self, board, player):
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


class Rook(Piece):
    _name = "Rook"

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player):
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


class Queen(Piece):
    _name = "Queen"

    def get_allowed_movements(self, board, player):
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


class King(Piece):
    _name = "King"

    def __init__(self, color):
        super().__init__(color)
        self._moved = False

    def get_allowed_movements(self, board, player):
        row, col = self._row, self._col
        allowed_movements = []

        if col > 0:
            if row > 0 and self.is_opponent_and_not_check(board, player, row - 1, col - 1):
                allowed_movements.append((row - 1, col - 1))
            if row < 7 and self.is_opponent_and_not_check(board, player, row + 1, col - 1):
                allowed_movements.append((row + 1, col - 1))
            if self.is_opponent_and_not_check(board, player, row, col - 1):
                allowed_movements.append((row, col - 1))
        if col < 7:
            if row > 0 and self.is_opponent_and_not_check(board, player, row - 1, col + 1):
                allowed_movements.append((row - 1, col + 1))
            if row < 7 and self.is_opponent_and_not_check(board, player, row + 1, col + 1):
                allowed_movements.append((row + 1, col + 1))
            if self.is_opponent_and_not_check(board, player, row, col + 1):
                allowed_movements.append((row, col + 1))
        if row > 0 and not self.is_check(board, player, row - 1, col):
            allowed_movements.append((row - 1, col))
        if row < 7 and not self.is_check(board, player, row + 1, col):
            allowed_movements.append((row + 1, col))

        return allowed_movements

    def is_opponent_and_not_check(self, board, player, row, col):
        return (board[row][col] is None or board[row][col].get_color() != player) and not self.is_check(board, player, row, col)

    def is_check(self, board, player, possibleRow, possibleCol):

        # threatens from rook
        i = possibleCol # move right
        while i < 7:
            i += 1
            if self.is_there_piece(board[possibleRow][i], player):
                if self.isRookOrQueen(board[possibleRow][i], player):
                    return True
                break
        i = possibleCol # move left
        while (i > 0):
            i -= 1
            if self.is_there_piece(board[possibleRow][i], player):
                if self.isRookOrQueen(board[possibleRow][i], player):
                    return True
                break
        i = possibleRow # move backwards
        while i < 7:
            i += 1
            if self.is_there_piece(board[i][possibleCol], player):
                if self.isRookOrQueen(board[i][possibleCol], player):
                    return True
                break
        i = possibleRow # move forward
        while i > 0:
            i -= 1
            if self.is_there_piece(board[i][possibleCol], player):
                if self.isRookOrQueen(board[i][possibleCol], player):
                    return True
                break

        # threatens from bishop
        i = possibleRow; j = possibleCol; # move right backwards
        while i < 7 and j < 7:
            i += 1; j += 1
            if self.is_there_piece(board[i][j], player):
                if self.isBishopOrQueen(board[i][j], player):
                    return True
                break
        i = possibleRow; j = possibleCol; # move right forward
        while i > 0 and j < 7:
            i -= 1; j += 1
            if self.is_there_piece(board[i][j], player):
                if self.isBishopOrQueen(board[i][j], player):
                    return True
                break
        i = possibleRow; j = possibleCol; # move left backwards
        while i < 7 and j > 0:
            i += 1; j -= 1
            if self.is_there_piece(board[i][j], player):
                if self.isBishopOrQueen(board[i][j], player):
                    return True
                break
        i = possibleRow; j = possibleCol; # move left forward
        while i > 0 and j > 0:
            i -= 1; j -= 1
            if self.is_there_piece(board[i][j], player):
                if self.isBishopOrQueen(board[i][j], player):
                    return True
                break

        # threatens from king, pawn or knight
        if possibleCol > 0:
            if possibleRow > 0 and self.isPawnOrKing(board[possibleRow - 1][possibleCol - 1], player):
                return True
            if possibleRow < 7 and self.isKing(board[possibleRow + 1][possibleCol - 1], player):
                return True
            if self.isKing(board[possibleRow][possibleCol - 1], player):
                return True
            if possibleRow < 6 and self.isKnight(board[possibleRow + 2][possibleCol - 1], player):
                return True
            if possibleRow > 1 and self.isKnight(board[possibleRow - 2][possibleCol - 1], player):
                return True
        if possibleCol < 7:
            if possibleRow > 0 and self.isPawnOrKing(board[possibleRow - 1][possibleCol + 1], player):
                return True
            if possibleRow < 7 and self.isKing(board[possibleRow + 1][possibleCol + 1], player):
                return True
            if self.isKing(board[possibleRow][possibleCol + 1], player):
                return True
            if possibleRow < 6 and self.isKnight(board[possibleRow + 2][possibleCol + 1], player):
                return True
            if possibleRow > 1 and self.isKnight(board[possibleRow - 2][possibleCol + 1], player):
                return True
        if possibleRow > 0:
            if self.isKing(board[possibleRow - 1][possibleCol], player):
                return True
            if possibleCol > 1 and self.isKnight(board[possibleRow - 1][possibleCol - 2], player):
                return True
            if possibleCol < 6 and self.isKnight(board[possibleRow - 1][possibleCol + 2], player):
                return True
        if possibleRow < 7:
            if self.isKing(board[possibleRow + 1][possibleCol], player):
                return True
            if possibleCol > 1 and self.isKnight(board[possibleRow + 1][possibleCol - 2], player):
                return True
            if possibleCol < 6 and self.isKnight(board[possibleRow + 1][possibleCol + 2], player):
                return True

        return False

    def is_there_piece(self, position, player):
        return position is not None and not (position.get_name() == "king" and position.get_color() == player) 

    def isRookOrQueen(self, position, player):
        return position is not None and position.get_color() != player and (position.get_name() == "rook" or position.get_name() == "queen")

    def isBishopOrQueen(self, position, player):
        return position is not None and position.get_color() != player and (position.get_name() == "bishop" or position.get_name() == "queen")
    
    def isKing(self, position, player):
        return position is not None and position.get_color() != player and position.get_name() == "king"

    def isPawnOrKing(self, position, player):
        return position is not None and position.get_color() != player and (position.get_name() == "pawn" or position.get_name() == "king")

    def isKnight(self, position, player):
        return position is not None and position.get_color() != player and position.get_name() == "knight"
