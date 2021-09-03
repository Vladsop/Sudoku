var boardNumbers = []; //Stores all valid numbers of the Sudoku game in order to reveal them if requested later on.
var selectedNumber = null; //Stores the current selected number by the user to fill the empty cells.

//Generates a random filled 9x9 game board according to the Sudoku game rules.
window.onload = function generateGrid() {
    document.getElementById("restartGame").style.display = "none";
    let container = document.querySelector(".grid");
    for (let line = 1; line <= 9; ++line) {
        for (let column = 1; column <= 9; ++column) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.id = line.toString() + column;
            container.appendChild(cell);
            if (cell.id < 71 && cell.id % 30 >= 1 && cell.id % 30 <= 9) {
                cell.style.borderBottom = "3px solid";
            }
            if (cell.id % 10 === 3 || cell.id % 10 === 6) {
                cell.style.borderRight = "3px solid";
            }
        }
    }
    let cells = document.getElementsByClassName("cell");
    let shiftOffset = [0, 3, 3, 1, 3, 3, 1, 3, 3]; // standard pattern to shift randomly generated 9 numbers array
    let fillArray = shiftNumbers(shiftOffset[0]);  // in order to prevent mixing same numbers on line/columns or 3x3 grid.
    for (let i = 1, j = 0; i <= 81; ++i) {
        boardNumbers[i - 1] = cells[i - 1].innerHTML = fillArray[j++];
        if (j > 8) {
            j = 0;
            shiftOffset.shift();
            fillArray = shiftNumbers(shiftOffset[0]);
        }
    }
    for (let i = 0; i < 64; ++i) {
        let buttons = document.getElementsByClassName("btn");
        let id = Math.floor(Math.random() * (99 - 11 + 1) + 11);
        if (id % 10 === 0) {
            ++id;
        }
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.backgroundColor = "lightgray";
        document.getElementById(id).onclick = function() {
            if (selectedNumber === null) {
                printMessage("Please select a number to fill with !");
            } else {
                document.getElementById(id).innerHTML = selectedNumber;
                buttons[selectedNumber].style.backgroundColor = "darkgray";
                buttons[selectedNumber].style.color = "black";
                selectedNumber = null;
                checkSudokuRules(id);
                gameStatus();
            }
        }
    }
    displayNumbers();
}

//Generates the numbers grid available to fill the board.
function displayNumbers() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let container = document.querySelector(".numbers");
    for (let i = 0; i < 9; ++i) {
        let button = document.createElement("button");
        button.className = "btn btn-secondary";
        button.id = numbers[i];
        button.onclick = function() {
            for (let i = 0; i < numbers.length; ++i) {
                buttons = document.getElementsByClassName('btn btn-secondary');
                buttons[i].style.backgroundColor = "darkgray";
                buttons[i].style.color = "black";
            }
            printMessage("");
            selectedNumber = button.id;
            button.style.backgroundColor = "black";
            button.style.color = "white";
        }
        container.appendChild(button);
        document.getElementById(numbers[i]).innerHTML = i + 1;
    }
}

//Shifts and returns the array according to the transmited offset when generating the game.
function shiftNumbers(offset) {
    let shiftArray = []; //Stores all numbers to be inserted in one line when creating the random game board.
    if (shiftArray.length === 0) {
        let validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; ++i) {
            position = Math.floor(Math.random() * validNumbers.length - 1) + 1;
            shiftArray[i] = validNumbers[position];
            validNumbers.splice(position, 1)
        }
    }
    for (let i = 0; i < offset; ++i) {
        shiftArray.push(shiftArray[0]);
        shiftArray.shift();
    }
    return shiftArray;
}

//Checks duplicates on corresponding row/column/3x3 grid according to the Sudoku rules.
function checkSudokuRules(id) {
    let cell = document.getElementById(id);
    cell.style.backgroundColor = "lightgray";
    let column = id % 10, line = parseInt(id / 10);
    let lineCoordinate = columnCoordinate = null;
    if (line <= 3) {
        lineCoordinate = 1;
    } else if (line >= 4 && line <= 6) {
        lineCoordinate = 4;
    } else {
        lineCoordinate = 7;
    }
    if (column <= 3) {
        columnCoordinate = 1;
    } else if (column >= 4 && column <= 6) {
        columnCoordinate = 4;
    } else {
        columnCoordinate = 7;
    }
    let maxLine = lineCoordinate + 2, maxColumn = columnCoordinate + 2, counter = 0;
    for (let i = lineCoordinate; i <= maxLine; ++i) { //checking 3x3grid;
        for (let j = columnCoordinate; j <= maxColumn; ++j) {
            let grid3x3Cells = document.getElementById(i.toString() + j.toString());
            if (grid3x3Cells.style.backgroundColor != "red") {
            grid3x3Cells.style.backgroundColor = "#0dcaf0";
            setTimeout(function () {grid3x3Cells.style.backgroundColor = "lightgray";}, 1000);
            }
            if (cell.innerHTML === grid3x3Cells.innerHTML) {
                ++counter;
            }
        }
    }
    for (let i = 1; i <= 9; ++i) { //checking Lines
        let lineCells = document.getElementById(line.toString() + i.toString());
        if (lineCells.style.backgroundColor != "red") {
            lineCells.style.backgroundColor = "#0dcaf0";
            setTimeout(function () {lineCells.style.backgroundColor = "lightgray";}, 1000);
        }
        if (cell.innerHTML === lineCells.innerHTML) {
            ++counter;
        }
    }
    for (let i = 1; i <= 9; ++i) { //checking Columns
        let columnCells = document.getElementById(i.toString() + column.toString());
        if (columnCells.style.backgroundColor != "red") {
        columnCells.style.backgroundColor = "#0dcaf0";
        setTimeout(function () {columnCells.style.backgroundColor = "lightgray";}, 1000);
        }
        if (cell.innerHTML === columnCells.innerHTML) {
            ++counter;
        }
    }
    if (counter > 3) {
        cell.style.backgroundColor = "red";
        setTimeout(function () {cell.style.backgroundColor = "red";}, 1001);
        printMessage("You need to make a better selection!")
    }
}

//When called checks the game status by counting all the filledValidCells(not empty and red flagged);
function gameStatus() {
    let filledValidCells = 0;
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].innerHTML != "" && cells[i].style.backgroundColor != "red") {
            ++filledValidCells;
        }
    }
    if (filledValidCells === cells.length) {
        message.style.animation = "bounce 0.4s infinite alternate";
        printMessage("Congratulations, you won the game!");
        document.getElementById("restartGame").style.display = "block";
    }
}

//Reveals the solution for the random generated game.
function revealSolution() {
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; ++i) {
        cells[i].innerHTML = boardNumbers[i];
        if(cells[i].style.backgroundColor === "red") {
            cells[i].style.backgroundColor = "lightgray";
        }
        cells[i].onclick = null;
    }
    printMessage("Don't give up so easily. Focus better next time!")
    document.getElementById("restartGame").style.display = "block";
}

//Prints all messages according to parameters it receives from the other functions.
function printMessage(message) {
    return document.getElementById("message").innerHTML = message;
}
