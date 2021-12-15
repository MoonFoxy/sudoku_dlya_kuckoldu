#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
A simple backtracking Sudoku generator
"""

import math
import random

from grid import Grid
from decorators import requires_grid


class Sudoku(Grid):
	DIFFICULTY = {
		'MIN': -1,
		'EASY': 0,
		'MEDIUM': 1,
		'HARD': 2,
		'EXPERT': 3,
		'INSANE': 4,
		'GOOD_LUCK': 5,
	}
	__VALID_SIZES = (2, 3, 4, 5) #Доступыне размеры поля
	__SCALE =  {
		-1: 0.65,	#Минимальный размер
		0: 0.45,	#Легкий уровень сложности
		1: 0.35,	#Средний уровень сложности
		2: 0.30,	#Сложный уровень сложности
		3: 0.24,	#Экспертный уровень сложности
		4: 0.17,	#Безумный уровень сложности
		5: 0.12,	#НЕВОЗМОЖНЫЙ уровень сложности
	}
					  #размер сетки #Сложность
	def __init__(self, grid_size = 3, difficulty = DIFFICULTY['MEDIUM']):
		self.grid_size = None
		self.difficulty = None
		self.grid = None
		self._masked = None
		self.set_grid_size(grid_size)	#Проверка на правильность ввода размера
		self.set_difficulty(difficulty)	#Проверка на правильность ввода сложности

	def init_grid(self, grid_size = None):
		Grid.init_grid(self)
		self.mix(random.randint(self.grid_size, self.grid_size ** 2))

	def clear(self):
			#Очищает решение судоку
		"""Cleans up the Sudoku solution"""
		self.grid_size = None
		self.grid = None
		self._masked = None

	def set_difficulty(self, difficulty):
		#Устанавливает уровень сложности для маскированной сетки
		"""Sets the difficulty level for a masked grid"""

		valid_diff = list(self.__SCALE.keys())

		if difficulty in valid_diff:
			self.difficulty = difficulty
		else:
			raise ValueError(f'Invalid difficulty level.     Options are: {valid_diff}')

	# Декоратор @property облегчает создание свойств в классах Python.
	# Свойства выглядят как обычные атрибуты (поля) класса, но при их чтении вызывается геттер (getter),
	# при записи – сеттер (setter), а при удалении – делитер (deleter).
	@property
	@requires_grid
	def masked_grid(self):
		# Создает и кеширует судоку с несколькими скрытыми квадратами
		"""Generates and caches a Sudoku with several squares hidden"""

		if self._masked is None:
			side_length = self.grid_size ** 2
			# math.floor(x) Округляет в меньшую сторону
			min = math.floor(Sudoku.__SCALE[self.difficulty] * side_length ** 2)	#Минимальное количество квадратов для скрытия
			# math.ceil(x) округление до ближайшего большего числа
			max = math.ceil(Sudoku.__SCALE.get(self.difficulty - 1, min) * side_length ** 2)	#Максимальное количество квадратов для скрытия

			numbers_to_show = random.randint(min, max)
			# random.randint(A, B) - случайное целое число N, A ≤ N ≤ B.

			masked = [True for i in range(numbers_to_show)] + \
					['0' for i in range(side_length ** 2 - numbers_to_show)]

			masked = [[masked[(j * side_length) + i] for j in range(side_length)] for i in range(side_length)]
			for i in range(side_length):
				random.shuffle(masked[i])

			# random.shuffle(masked)
			# (row * side_length) + col
			self._masked = [[self.grid[i][j] if masked[i][j] == True else 0 for j in range(side_length)] for i in range(side_length)]

		return self._masked

	@requires_grid
	def print_grid(self, grid = None):
		"""Prints a nicely formatted version of the Sudoku grid"""
		if grid is None:
			grid = self.grid

		side_length = self.grid_size ** 2
		field_width = len(str(side_length)) + 2
		format = ''.join(['%s' for i in range(self.grid_size)])
		format = '|'.join([format for i in range(self.grid_size)])

		for row in range(side_length):
			values = tuple(str(value).center(field_width) for value in grid[row])
			print(format % values)

			# print a dividing line for each set of regions
			if row < side_length - 1 and (row + 1) % self.grid_size == 0:
				print('+'.join('-' * field_width * self.grid_size for i in range(self.grid_size)))

	def print_solution(self):
		"""Prints the generated solution nicely formatted"""

		return self.print_grid()

	def print_masked(self):
		"""Prints a masked version of the grid"""

		return self.print_grid(self.masked_grid)

def main():
	import sys
	try:
		size = int(sys.argv[1])
	except IndexError:
		size = 5
	sudoku = Sudoku(size, difficulty = Sudoku.DIFFICULTY['GOOD_LUCK'])
	print(sudoku.grid_size)
	sudoku.print_solution()
	print('=' * (size ** 3 + size - 1))
	sudoku.print_masked()

if __name__ == '__main__':
	main()
