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
        
    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]


class Knight(Piece):
    _name = "Knight"

    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]


class Bishop(Piece):
    _name = "Bishop"

    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]


class Rook(Piece):
    _name = "Rook"

    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]


class Queen(Piece):
    _name = "Queen"

    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]


class King(Piece):
    _name = "King"

    def get_allowed_movements(self, board):
        return ["c3", "d3", "e3"]
