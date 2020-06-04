# Simple Sudoku Generator and Resolver
This project is a simple library written in Javascript to generate sudokus even be able to solve them. To give it more dynamism, initially it randomly fills N cells inside the puzzle (following the basic rules of row, column and group). Then it solves the sudoku with those random numbers included and once it's proven to be soluble, it hides some of the numbers so that the user gets a sudoku to play.

This library is designed for lightweight machines without many resources, so to stop the resolution process if it enters a loop, this library has a mechanism that stops the execution of the function "solve" if it exceeds a given number of executions.

It's coded in one afternoon, so don't expect any wonders either.  ;)
