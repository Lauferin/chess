export const MOVEMENTS_URL = "http://localhost:8000/api/movements/";
export const GAMES_URL = "http://localhost:8000/api/games/";

export const WHITE = true
export const BLACK = false

export const GAME_ON = 0
export const CHECKMATE_OPPONENT = -3
export const CHECKMATE_PLAYER = -1
export const DRAWN = -2
export const NOT_ENOUGH_PIECES = -3
export const REPEATED_SEQUENCE = -4

export const PAWN = 1
export const KNIGHT = 2
export const BISHOP = 3
export const ROOK = 4
export const QUEEN = 5
export const KING = 6
export const LEFT_ROOK = 7
export const RIGHT_ROOK = 8

export const translatePromotionToConstant = {
    "knight": KNIGHT,
    "bishop": BISHOP,
    "rook": ROOK,
    "queen": QUEEN
}

export const translatePromotionToName = {
    [KNIGHT]: "knight",
    [BISHOP]: "bishop",
    [ROOK]: "rook",
    [QUEEN]: "queen"
}
