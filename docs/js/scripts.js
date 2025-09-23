const Cell = () => {
    let value = 0; 
    function getValue() {
        return value;
    }

    function setValue(token){
        value = token;
    }

    return {
        getValue, setValue
    }
}

const gameBoard = () => {
    board = [];
    size = 3;

    for (let i=0; i<size; i++){
        board.push([])
        for (let j=0; j<size; j++){
            board[i].push(Cell());
        }
    }

    const printGameBoard = () => {
        boardWithValue = board.map(row => row.map(column => column.getValue()));
        console.log(boardWithValue);
    }

    const putToken = (row, column, token) => {
        if (board[row][column].getValue() === 0){
            board[row][column].setValue(token);
            return true;
        }
    }

    const getBoard = () => {
        return board;
    }
    return {
        printGameBoard, getBoard, putToken
    }
}

const gameController = (function(){
    playerList = [
        {
            name: "Player 1",
            token: "o"
        },
        {
            name: "Player 2",
            token:"x"
        } 
    ];

    const board = gameBoard();
    board.printGameBoard();

    let activePlayer = playerList[0];
    console.log(`It's ${activePlayer.name} turn`);

    const switchPlayer= () => {
        activePlayer = (activePlayer === playerList[0]) ? playerList[1] : playerList[0];
        console.log(`It's ${activePlayer.name} turn`);
    }

    const getActivePlayer = function(){
        return activePlayer;
    }

    const checkWin = function(row, column, token){
        const directions = [
            [0,1], [1,0], [-1,1], [1,1]
        ]

       // horizontal checking
       for (let i=0; i<directions.length; i++){
            const [rowstep, columnstep] = directions[i];
            count = 1;
            for (let j=1; j<=2; j++){
                if(row+(j*rowstep) >= 3 || column+(j*columnstep) >= 3 || row+(j*rowstep) <= -1 || column+(j*columnstep) <= -1){
                    continue;
                }
                if(board.getBoard()[row+(j*rowstep)][column+(j*columnstep)].getValue() != token){
                    break;
                }
                count++;
                if (count== 3){
                    return true;
                }
            }

            for (let j=-1; j>=-2; j--){
                if(row+(j*rowstep) >= 3 || column+(j*columnstep) >= 3 || row+(j*rowstep) <= -1 || column+(j*columnstep) <= -1){
                    continue;
                }
                if(board.getBoard()[row+(j*rowstep)][column+(j*columnstep)].getValue() != token){
                    break;
                }
                count++;
                if (count === 3){
                    return true;
                }
            }
        }
    }


    const playRound= (row, column) => {
        const sucessPut = board.putToken(row, column, getActivePlayer().token)
        if (sucessPut === true){
            const winnerbool = checkWin(row, column, getActivePlayer().token);
            board.printGameBoard();
            if (winnerbool == true){
                console.log(`Congratulations ${activePlayer.name} win the game!`);
                newGame();
                board.printGameBoard();
                return;
            }
            switchPlayer();
        } else {

        }
    }

    const newGame = () => {
        let newBoard = board.getBoard();
        size=3;
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                newBoard[i][j].setValue(0);
            }
        }
    }

    return {
        playRound, getActivePlayer
    }
    

})()