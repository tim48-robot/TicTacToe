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
    const winNumber = [];
    board.printGameBoard();

    let activePlayer = playerList[0];

    const switchPlayer= () => {
        activePlayer = (activePlayer === playerList[0]) ? playerList[1] : playerList[0];
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
            winNumber.length = 0;
            winNumber.push([row + "" + column])
            for (let j=-2; j<=2; j++){
                if (j===0) continue;
                if(row+(j*rowstep) >= 3 || column+(j*columnstep) >= 3 || row+(j*rowstep) <= -1 || column+(j*columnstep) <= -1){
                    continue;
                }
                if(board.getBoard()[row+(j*rowstep)][column+(j*columnstep)].getValue() != token){
                    break;
                }
                count++;
                winNumber.push([(row+(j*rowstep)) + "" + (column+(j*columnstep))]);
                if (count== 3){
                    return true;
                }
            }
        }
    }

    const checkTie = function(){
        let flag = true;
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                if (board.getBoard()[i][j].getValue() === 0){
                    flag = false;
                }
            }
        }
        return flag;
    }

    const getWinNumber = function(){
        return winNumber;
    }

    const playRound= (row, column) => {
        const sucessPut = board.putToken(row, column, getActivePlayer().token)
        if (sucessPut === true){
            const winnerbool = checkWin(row, column, getActivePlayer().token);
            const isTie = checkTie();
            if (winnerbool === true){
                return "win";
            } else if (isTie === true){
                return "tie";
            }
            else {
                board.printGameBoard();
            }
            switchPlayer();
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
        playRound, getActivePlayer, getWinNumber, newGame
    }
    

})()

const colorButton = (array) =>{
    for (let i=0; i<array.length; i++){
        const button = document.querySelector(`[class="${array[i]}"]`);
        button.style.backgroundColor = "rgba(121, 50, 173, 1)";
    }
}

const disableAttribute = (buttons, bool) => {
    if (bool === false){
        buttons.forEach(button => {
            if (button.className === "new-game"){
                return;
            }
            result.textContent = "It's Player 1 Turn!"
            button.style.backgroundColor = "rgb(225, 224, 224)";
            button.textContent = "";
            button.disabled = false;
        })
    }
    else {
        buttons.forEach(button => {
            if (button.className === "new-game"){
                return;
            }
            button.disabled = true;
        })
    }
}


const allButton = document.querySelectorAll("button");
const result = document.querySelector("#result");
const newGame = document.querySelector(".new-game");

allButton.forEach(button => button.addEventListener("click", (e) => {
    if (button.className === "new-game") return;
    if (button.textContent === ""){
        button.textContent = gameController.getActivePlayer().token;        
    }
    const cool = gameController.playRound(parseInt(button.className[0]), parseInt(button.className[1]));
    result.textContent = `It's ${gameController.getActivePlayer().name} Turn`
    if (cool === "tie"){
        result.textContent = `It's a tie!`;
        disableAttribute(allButton, true);
    }  
    else if (cool === "win"){
        colorButton(gameController.getWinNumber());    
        result.textContent = `Congratulations! ${gameController.getActivePlayer().name} Won`
        disableAttribute(allButton, true);
    }
}))

newGame.addEventListener("click", () => {
    disableAttribute(allButton, false);
    gameController.newGame();
})