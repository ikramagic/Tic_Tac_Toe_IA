class Morpion {
    humanPlayer = "Tôa";
    iaPlayer = "IA";
    gameOver = false;
    gridMap = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    constructor(firstPlayer = "J1") {
        this.humanPlayer = firstPlayer;
        this.iaPlayer = firstPlayer === "J1" ? "IA" : "J1";
        this.initGame();
    }

    initGame = () => {
        this.gridMap.forEach((line, y) => {
            line.forEach((_cell, x) => {
                this.getCell(x, y).onclick = () => {
                    if (this.humanPlayer === "J1") {
                        if (this.drawHit(x, y, "J1")) {
                            this.doPlayIa();
                        }
                    } else {
                        if (this.drawHit(x, y, "IA")) {
                            this.doPlayIa();
                        }
                    }
                };
            });
        });

        if (this.iaPlayer === "J1") {
            this.doPlayIa();
        }
    };

    getCell = (x, y) => {
        const column = x + 1;
        const lines = ["A", "B", "C"];
        const cellId = `${lines[y]}${column}`;
        return document.getElementById(cellId);
    };

    getBestMove(board, currentPlayer) {
        let bestScore = -Infinity;
        let bestMove;

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] === null) {
                    board[y][x] = currentPlayer;
                    let score = this.minimax(board, false);
                    board[y][x] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { x, y };
                    }
                }
            }
        }

        return bestMove;
    }

    minimax(board, isMaximizingPlayer) {
        let winner = this.getBoardWinner(board);
        if (winner !== null) {
            return winner === this.iaPlayer ? 10 : winner === 'tie' ? 0 : -10;
        }

        if (isMaximizingPlayer) {
            let bestScore = -Infinity;
            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (board[y][x] === null) {
                        board[y][x] = this.iaPlayer;
                        let score = this.minimax(board, false);
                        board[y][x] = null;
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (board[y][x] === null) {
                        board[y][x] = this.humanPlayer;
                        let score = this.minimax(board, true);
                        board[y][x] = null;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    getBoardWinner = (board) => {
        const isWinningRow = ([a, b, c]) => a !== null && a === b && b === c;

        let winner = null;

        board.forEach((line) => {
            if (isWinningRow(line)) {
                winner = line[0];
            }
        });

        [0, 1, 2].forEach((col) => {
            if (isWinningRow([board[0][col], board[1][col], board[2][col]])) {
                winner = board[0][col];
            }
        });

        if (winner) {
            return winner;
        }

        const diagonal1 = [board[0][0], board[1][1], board[2][2]];
        const diagonal2 = [board[0][2], board[1][1], board[2][0]];
        if (isWinningRow(diagonal1) || isWinningRow(diagonal2)) {
            return board[1][1];
        }

        const isFull = board.every((line) =>
            line.every((cell) => cell !== null)
        );
        return isFull ? "tie" : null;
    };

	checkWinner = () => {
		const winner = this.getBoardWinner(this.gridMap);
		if (!winner) {
			return;
		}
	
		this.gameOver = true;
		switch (winner) {
			case "tie":
				this.displayEndMessage("It's a tie !");
				break;
			case this.iaPlayer:
				this.displayEndMessage("Deep Flou sneak-attacked you !");
				break;
			case this.humanPlayer:
				this.displayEndMessage(
					"You defeated Deep Flou and healed your myopia, it's a miracle !"
				);
				break;
		}
	};
	

    displayEndMessage = (message) => {
        const endMessageElement = document.getElementById("end-message");
        endMessageElement.textContent = message;
        endMessageElement.style.display = "block";
    };

    drawHit = (x, y, player) => {
        if (this.gridMap[y][x] !== null) {
            return false;
        }

        this.gridMap[y][x] = player;
        this.getCell(x, y).classList.add(`filled-${player}`);
        this.checkWinner(player);
        return true;
    };

    doPlayHuman = (x, y) => {
        if (this.gameOver) {
            return;
        }

        if (this.drawHit(x, y, this.humanPlayer)) {
            this.doPlayIa();
        }
    };

	doPlayIa = () => {
		if (this.gameOver) {
			return;
		}
	
		const bestMove = this.getBestMove(this.gridMap, this.iaPlayer);
		if (bestMove !== null) {
			this.drawHit(bestMove.x, bestMove.y, this.iaPlayer);
			this.getCell(bestMove.x, bestMove.y).classList.add(`filled-${this.iaPlayer}`);
		}
	};	
}