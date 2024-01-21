class Morpion {
    humanPlayer = 'J1';
    iaPlayer = 'IA Deep Flou';
    gameOver = false;
    gridMap = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    constructor(firstPlayer = 'J1') {
        this.humanPlayer = firstPlayer;
        this.iaPlayer = (firstPlayer === 'J1') ? 'IA Deep Flou' : 'J1';
        this.initGame();
    }

	initGame = () => {
		this.gridMap.forEach((line, y) => {
			line.forEach((cell, x) => {
				this.getCell(x, y).onclick = () => {
					this.doPlayHuman(x, y);
				};
			});
		});

		if (this.iaPlayer === 'J1') {
			this.doPlayIa();
		}
	}

	getCell = (x, y) => {
		const column = x + 1;
		const lines = ['A', 'B', 'C'];
		const cellId = `${lines[y]}${column}`;
		return document.getElementById(cellId);
	}

	minimax(node, maximizingPlayer) {
		if (node.children === undefined) {
			return node.score;
		}
	
		if (maximizingPlayer) {
			let maxScore = -Infinity;
			for (const child of node.children) {
				const score = this.minimax(child, false);
				maxScore = Math.max(maxScore, score);
			}
			return maxScore;
		} else {
			let minScore = Infinity;
			for (const child of node.children) {
				const score = this.minimax(child, true);
				minScore = Math.min(minScore, score);
			}
			return minScore;
		}
	}

	getBestMove(board, currentPlayer) {
		const possibilitiesTree = this.createPossibilitiesTree(board, currentPlayer, depth); 
		const bestMove = { score: -Infinity, move: null };
	
		for (const child of possibilitiesTree.children) {
			const score = this.minimax(child, false);
			if (score > bestMove.score) {
				bestMove.score = score;
				bestMove.move = child.move;
			}
		}
	
		return bestMove.move;
	}
	

    getBoardWinner = (board) => {
        const isWinningRow = ([a, b, c]) => (
            a !== null && a === b && b === c
        );

        let winner = null;

        // Horizontal
        board.forEach((line) => {
            if (isWinningRow(line)) {
                winner = line[0];
            }
        });

        // Vertical
        [0, 1, 2].forEach((col) => {
            if (isWinningRow([board[0][col], board[1][col], board[2][col]])) {
                winner = board[0][col];
            }
        });

        if (winner) {
            return winner;
        }

        // Diagonal
        const diagonal1 = [board[0][0], board[1][1], board[2][2]];
        const diagonal2 = [board[0][2], board[1][1], board[2][0]];
        if (isWinningRow(diagonal1) || isWinningRow(diagonal2)) {
            return board[1][1];
        }

        const isFull = board.every((line) => (
			line.every((cell) => cell !== null)
		));
        return isFull ? 'tie' : null;
    }

	checkWinner = (lastPlayer) => {
        const winner = this.getBoardWinner(this.gridMap);
        if (!winner) {
            return;
        }

        this.gameOver = true;
        switch(winner) {
            case 'tie':
			    this.displayEndMessage("It's a tie !");
                break;
            case this.iaPlayer:
                this.displayEndMessage("Deep Flou sneak-attacked you !");
                break;
            case this.humanPlayer:
                this.displayEndMessage("You defeated Deep Flou and healed your myopia, it's a miracle !");
                break;
        }
	}

	displayEndMessage = (message) => {
		const endMessageElement = document.getElementById('end-message');
		endMessageElement.textContent = message;
		endMessageElement.style.display = 'block';
	}

	drawHit = (x, y, player) => {
		if (this.gridMap[y][x] !== null) {
			return false;
		}

		this.gridMap[y][x] = player;
		this.getCell(x, y).classList.add(`filled-${player}`);
		this.checkWinner(player);
		return true;
	}

	doPlayHuman = (x, y) => {
		if (this.gameOver) {
			return;
		}

		if (this.drawHit(x, y, this.humanPlayer)) {
			this.doPlayIa();
		}
	}

	doPlayIa = () => {
		if (this.gameOver) {
			return;
		}
	
		const bestMove = this.getBestMove(this.gridMap, this.iaPlayer);
		if (bestMove !== null) {
			this.drawHit(bestMove.x, bestMove.y, this.iaPlayer);
		}
	}	
}
