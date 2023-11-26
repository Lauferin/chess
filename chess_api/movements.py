from .util import parse
import random


def get_movement(board, pieces, player, algorithm):
    
    def basic():
        allowed_movements = []
        player_pieces = [piece for piece in pieces if piece.get_color() == player]
        for piece in player_pieces:
            allowed_movements += [(parse(*piece.get_position(), player), parse(movement[0], movement[1], player), movement[2]) if len(movement) == 3
                                    else (parse(*piece.get_position(), player), parse(movement[0], movement[1], player))
                                    for movement in piece.get_allowed_movements(board, player)]

        print(allowed_movements)
        selected_movement = random.choice(allowed_movements)
        print(selected_movement)

        movement = {
            "state": "ok", # or checkmate, or others
            "piece": selected_movement[0],
            "movement": selected_movement[1],
            "promoted": selected_movement[2] if len(selected_movement) == 3 else None
        }

        return movement


    def basic2():
        return "This is case 2"


    def basic3():
        return "This is case 3"


    algorithms = {
        "basic2": basic2,
        "basic3": basic3
    }

    return algorithms.get(algorithm, basic)()
