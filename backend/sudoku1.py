#!/usr/bin/env python

# Sudoku Solver Py 1.0 - finds all possible solutions for a given initial board
# Copyright (C) 2006 Hrishikesh Tapaswi <hrishikesh@gmail.com>

# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


# Sudoku solver
# written by Hrishikesh Tapaswi
# finds all solutions for a given initial board

# Enter 81 digits one after the other separated by spaces as command line arguments (0 for empty square) - in row major order
# eg.
# $ python sudoku.py 0 0 0 0 0 0 0 1 4 2 0 0 5 0 0 6 0 0 9 0 0 3 0 0 0 0 0 0 5 0 0 1 0 0 3 0 0 8 0 0 3 0 0 7 0 0 6 0 0 2 0 0 9 0 0 0 0 0 0 8 0 0 2 0 0 3 0 0 4 0 0 1 5 7 0 0 0 0 0 0 0

import sys#ki

"""Sudoku solver"""

class SudokuBoard:
	'''Class definition for sudoku solver'''

	def __init__(self, given=None): #given is a list with 81 numbers (0-9)
		if given == None:
			given = [0 for i in xrange(81)]
		else:
			given = [int(i) for i in given]
		self.state = [given[i:i+9] for i in range(0, 81, 9)]

	def __str__(self):
		result = ''
		for i in xrange(9):
			for j in xrange(9):
				result += `self.state[i][j]` + '   '
			result += '\n'
		return result

	def getRow(self, i, j):
		return self.state[i]

	def getColumn(self, i, j):
		return [self.state[k][j] for k in xrange(9)]

	def getTile(self, i, j):		#Tile is the 3x3 square
		return [self.state[ii][jj] for ii in range(i/3*3, i/3*3 + 3) for jj in range(j/3*3, j/3*3 + 3)]

	def generateMoveList(self):
		'''Generates the possible digits that could fit in a square that has min number of possible digits'''
		best = 10		#number of numbers that could fit
		S = range(1, 10)
		for i in xrange(9):
			for j in xrange(9):
				digits = set(S) - set(self.getRow(i, j)) - set(self.getColumn(i, j)) - set(self.getTile(i, j)) - set([0])
				if not self.state[i][j] and len(digits) < best:
					best = len(digits)
					self.moveList = [(i, j, num) for num in digits]

	def isGoal(self):
		'''Determines if the current state is a goal state'''
		S = range(1, 10)
		for i in xrange(9):
			if set(S) != set(self.getRow(i, 0)) or set(S) != set(self.getColumn(0, i)):
				return 0
		for i in range(0, 9, 3):
			for j in range(0, 9, 3):
				if set(S) != set(self.getTile(i, j)):
					return 0
		return 1

	def isValid(self):
		'''Checks if the given board position is a valid position'''
		for i in xrange(9):
			for j in xrange(9):
				row = list(self.getRow(i, j))
				row = [ii for ii in row if ii != 0]
				column = list(self.getColumn(i, j))
				column = [ii for ii in column if ii != 0]
				if len(row) > len(set(row)) or self.state[i][j] not in range(10): return 0
				if len(column) > len(set(column)) or self.state[i][j] not in range(10): return 0
		for i in range(0, 9, 3):
			for j in range(0, 9, 3):
				tile = list(self.getTile(i, j))
				tile = [ii for ii in tile if ii != 0]
				if len(tile) > len(set(tile)): return 0
		return 1

	def move(self, move):	#move is (x, y, num) - put num in square (x, y)
		'''Moves current board state as per the move'''
		self.state[move[0]][move[1]] = move[2]
	
	def solve(self):
		'''the main function to solve the board'''
		if self.isGoal():
			print 'Found solution - '
			print self
			return

		self.generateMoveList()
		while self.moveList:
			currentMove = self.moveList.pop(0)
			copyCurrentBoard = SudokuBoard()
			copyCurrentBoard.state = [list(i) for i in self.state]
			copyCurrentBoard.move(currentMove)
			copyCurrentBoard.solve()


# Now solve the puzzle
if __name__ == '__main__':
	if len(sys.argv) == 1:
		print '81 digits of the initial board to be entered in row major order as command line arguments'
		sys.exit(1)
	board = SudokuBoard(sys.argv[1:])
	print "Given board is - \n", board
	if not board.isValid():
		print "Board is invalid"
		sys.exit(1)
	print "Solving...\n"
	board.solve()

