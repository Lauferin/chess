from .constants import WHITE, BLACK, KING

def parse(row, column, player):
    columnResult = chr(97 + column) if player == BLACK else chr(97 + (7 - column))
    rowResult = row + 1 if player == WHITE else 8 - row 
    return f"{columnResult}{rowResult}"


def unparse(position, player):
    columnResult = ord(position[0]) - 97 if player == BLACK else 7 - ord(position[0]) + 97
    rowResult = int(position[1]) - 1 if player == WHITE else 8 - int(position[1]); 
    return columnResult, rowResult


def is_castling(board, movement_row, movement_column, piece_column):
    if board[movement_row][movement_column].get_name() == KING and abs(movement_column - piece_column) == 2:
        return True
    return False
