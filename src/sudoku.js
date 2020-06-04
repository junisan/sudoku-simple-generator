const RANDOM_NUMBERS_IN_INITIALIZATION = 8

const MAXIMUM_NUMBER_ITERATIONS_UNTIL_UNSOLVABLE = 1000;

class Sudoku
{
    /**
     * Initialize a puzzle with a number N of pre-set numbers. The general configuration is
     *  easy => 42
     *  normal => 31
     *  hard => 26
     *  extreme => 20
     * @param {number} N Number of numbers to be displayed (31 by default)
     */
    constructor(N) {
        if (typeof N !== 'number') {
            N = 31;
        }

        if (N < 17) {
            throw new RangeError('It is not possible to resolve a sudoku with less than 17 numbers');
        }

        if (N > 81) {
            throw new RangeError('Sudoku must have a maximum of 81 numbers');
        }

        while (true) {
            try{
                this.grid = new Array(81).fill(0);
                this.originalGrid = new Array(81).fill(0);

                this._generateSeed(RANDOM_NUMBERS_IN_INITIALIZATION);

                this.resolve();

                break;
            }catch(e){}
        }

        this._hideNumbers(81-N);
        this.originalGrid = [...this.grid];
        this.numLength = N;
    }

    /**
     * Returns if the puzzle is completed and resolved
     * @return {boolean} True if resolved
     */
    isResolved() {
        return this.numLength === 81;
    }

    /**
     * Returns current state of puzzle
     * @returns {number[]}
     */
    getCurrentGrid(){
        return this.grid;
    }

    /**
     * Try to set a value at point (X,Y)
     * Considering (0.0) the upper left corner and (8.8) the lower right corner
     * If a puzzle premise is broken, it will return false
     * @param {number} value Number from 0 to 9. 0 is same as clear value.
     * @param {number} xPos Position on the x-axis. From 0 to 8.
     * @param {number} yPos Position on the y-axis. From 0 to 8.
     * @return boolean
     */
    setNumber(value, xPos, yPos)
    {
        if (this.originalGrid[yPos*9 + xPos] !== 0) {
            return false;
        }

        if (value === 0) {
            this.grid[yPos*9+xPos] = 0;
            this.numLength--;
            return true;
        }

        if (this._isSafe(value, xPos, yPos)){
            this.grid[yPos*9+xPos] = value;
            this.numLength++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the value of a position (xPos,yPos) or zero if it has not been set
     * @param {number} xPos
     * @param {number} yPos
     */
    getNumber(xPos, yPos)
    {
        return this.grid[yPos * 9 + xPos];
    }

    /**
     * Resolves puzzle calling recursive function _resolveMatrix
     */
    resolve()
    {
        this.SOLVE_ITERATIONS_LEFT = MAXIMUM_NUMBER_ITERATIONS_UNTIL_UNSOLVABLE;
        this._resolveMatrix(0,0);

    }

    /**
     * Solve the puzzle recursively.
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     * @throws Error If sudoku is unresolvable or require to much operations.
     * @private
     */
    _resolveMatrix(x, y)
    {
        if (this.SOLVE_ITERATIONS_LEFT < 0) {
            throw new Error('Soduko unsolvable');
        } else {
            this.SOLVE_ITERATIONS_LEFT--;
        }

        let nextX = (x+1)%9;
        let nextY = x === 8 ? y+1 : y;

        if (y === 9) {
            return true;
        }

        if (this.getNumber(x,y) !== 0) {
            return this._resolveMatrix(nextX, nextY);
        } else {
            for(let i = 1; i <= 9; i++) {
                if (this.setNumber(i, x, y)) {
                    if (this._resolveMatrix(nextX, nextY)) {
                        return true;
                    }
                }
            }
            this.setNumber(0, x, y);
            return false;
        }
    }

    /**
     * Print the puzzle in a human-friendly format
     * @param {number[]} matrix Puzzle to print
     * @private
     */
    _prettyPrint(matrix)
    {
        for(let y = 0; y < 9; y++) {
            let xRow = '|';
            for(let x = 0; x < 9; x++) {
                xRow += matrix[y*9+x] + '|';
            }
            console.log(xRow);
        }
        console.log('----');
    }

    /**
     * Checks if a number satisfies the three rules of puzzle position (row, column and group) given it position
     * @param {number} value Number to check
     * @param {number} x Position on the x-axis. From 0 (left) to 8 (right).
     * @param {number} y Position on the y-axis. From 0 (top) to 8 (down).
     * @return {boolean} If the number is valid for that position
     * @private
     */
    _isSafe(value, x, y) {
        return this._isValidGroup(value, x,y) && this._isValidRow(value, x, y) && this._isValidCol(value, x, y);
    }

    /**
     * Checks if the number is valid with respect to row (X axis)
     * @param {number} value Number to check
     * @param {number} xPos Position on the x-axis. From 0 (left) to 8 (right).
     * @param {number} yPos Position on the y-axis. From 0 (top) to 8 (down).
     * @return {boolean} If the number is valid for that position
     * @private
     */
    _isValidRow(value, xPos, yPos)
    {
        for(let x = 0; x <= 8; x++) {
            if (x === xPos) continue;
            const currentValue = this.getNumber(x, yPos);
            if (currentValue !== 0 && value === currentValue){
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the number is valid with respect to column (Y axis)
     * @param {number} value Number to check
     * @param {number} xPos Position on the x-axis. From 0 (left) to 8 (right).
     * @param {number} yPos Position on the y-axis. From 0 (top) to 8 (down).
     * @return {boolean} If the number is valid for that position
     * @private
     */
    _isValidCol(value, xPos, yPos)
    {
        for(let y = 0; y <= 8; y++ ){
            if (y === yPos) continue;
            const currentValue = this.getNumber(xPos, y)
            if (currentValue !== 0 && value === currentValue) return false;
        }
        return true;
    }

    /**
     * Checks if the number is valid with respect to neighboring numbers
     * @param {number} value Number to check
     * @param {number} xPos Position on the x-axis. From 0 (left) to 8 (right).
     * @param {number} yPos Position on the y-axis. From 0 (top) to 8 (down).
     * @return {boolean} If the number is valid for that position
     * @private
     */
    _isValidGroup(value, xPos, yPos)
    {
        const xGroup = Math.floor(xPos/3);
        const yGroup = Math.floor(yPos/3);
        const firstXGroupPos = xGroup * 3;
        const firstYGroupPos = yGroup * 3;

        for(let x = firstXGroupPos; x <= firstXGroupPos+2; x++) {
            for(let y = firstYGroupPos; y <= firstYGroupPos+2; y++) {
                if (xPos === x && yPos === y) continue;
                const currentValue = this.getNumber(x,y);
                if (currentValue !== 0 && value === currentValue){
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Hides the numbers in a sudoku based on the number of numbers you want to remove
     * @param {number} M Number of numbers to hide randomly
     * @private
     */
    _hideNumbers(M){
        let remainNumbers = M;
        while (remainNumbers > 0) {
            const x = this._randomNumber(0,8), y = this._randomNumber(0,8);
            let value = this.getNumber(x,y);
            if (value !== 0) {
                this.setNumber(0,x,y);
                remainNumbers--;
            }
        }
    }

    /**
     * Generates randomly N numbers in the sudoku grid
     * @param {number} N
     * @private
     */
    _generateSeed(N){
        let remainRandomNumbers = N;

        this.setNumber(this._randomNumber(1,9), 0 ,0);

        while (remainRandomNumbers > 1) {
            const x = this._randomNumber(0,8), y = this._randomNumber(0,8), value = this._randomNumber(1,9)
            if (this.getNumber(x,y) !== 0) {
                continue;
            }
            if (this.setNumber(value, x, y)) {
                remainRandomNumbers--;
            }
        }

    }

    /**
     * Returns a random number between min and max (both included)
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @private
     */
    _randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

module.exports = Sudoku;
