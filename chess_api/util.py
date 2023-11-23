def parse(row, column, player):
    columnResult = chr(97 + column) if player == "white" else chr(97 + (7 - column))
    rowResult = row + 1 if player == "black" else 8 - row 
    return f"{columnResult}{rowResult}"


def unParse(position, player):
    columnResult = ord(position[0]) - 97 if player == "white" else 7 - ord(position[0]) + 97
    rowResult = int(position[1]) - 1 if player == "black" else 8 - int(position[1]); 
    return columnResult, rowResult
