#!/usr/bin/env python
# -*- coding: utf-8 -*-
import random
#создание первоначальной матрицы
from decorators import requires_grid

class Grid:
	__VALID_SIZES = (2, 3, 4, 5)
	def __init__(self, grid_size = 3):
		""" Generation of the base table """
		self.grid_size = None
		self.grid = None
		self.set_grid_size(grid_size)

	def __del__(self):
		pass #into the ass

	def init_grid(self, grid_size = None):
		if grid_size is not None:
			self.set_grid_size(grid_size)

		self.grid = [
			[
				int((i * self.grid_size + i / self.grid_size + j) % (self.grid_size * self.grid_size) + 1) for j in range(self.grid_size ** 2)
			] for i in range(self.grid_size ** 2)
		]

	def clear(self):
		"""Cleans up the Sudoku solution"""
		self.grid_size = None
		self.grid = None

	def set_grid_size(self, grid_size):
		#Устанавливает размер сетки
		"""Sets the grid size"""
		if grid_size in self.__VALID_SIZES:
			self.grid_size = grid_size		# Устанавливаем размер сетки
			self.grid = None			#Очищаем таблицу
		else:
			raise ValueError(f'Invalid size.    Options are: {self.__VALID_SIZES}')

	@requires_grid
	def transposing(self):
		""" Transposing the whole grid """
		self.grid = list(map(list, zip(*self.grid)))
		# map(функция, то с чем работает)
		# zip(объединяет элементы из нескольких источников данных)

	@requires_grid
	def swap_rows_small(self):
		""" Swap the two rows """
		# random.randrange(start, stop, step) - возвращает случайно выбранное число из последовательности.
		area = random.randrange(0, self.grid_size, 1)	# Выбираем случайную область
		line1 = random.randrange(0, self.grid_size, 1)	# Выбираем случайную строку

		N1 = area * self.grid_size + line1	# Первый индекс

		line2 = random.randrange(0, self.grid_size, 1)	# Выбираем вторую строку

		while (line1 == line2):
			line2 = random.randrange(0, self.grid_size, 1) 	# Выбираем вторую строку

		N2 = area * self.grid_size + line2	# Второй индекс

		self.grid[N1], self.grid[N2] = self.grid[N2], self.grid[N1]

	@requires_grid
	def swap_colums_small(self):
		self.transposing()
		self.swap_rows_small()
		self.transposing()

	@requires_grid
	def swap_rows_area(self):
		""" Swap the two area horizon """
		area1 = random.randrange(0, self.grid_size, 1)
		#получение случайного района

		area2 = random.randrange(0, self.grid_size, 1)
		#ещё район, но не такой же самый
		while (area1 == area2):
			area2 = random.randrange(0, self.grid_size, 1)

		for i in range(0, self.grid_size):
			N1, N2 = area1 * self.grid_size + i, area2 * self.grid_size + i
			self.grid[N1], self.grid[N2] = self.grid[N2], self.grid[N1]

	@requires_grid
	def swap_colums_area(self):
		self.transposing()
		self.swap_rows_area()
		self.transposing()

	@requires_grid
	def mix(self,amt = 10):
		mix_func = [self.transposing,
					self.swap_rows_small,
					self.swap_colums_small,
					self.swap_rows_area,
					self.swap_colums_area]
		for i in range(1, amt):
			id_func = random.randrange(0,len(mix_func),1)
			mix_func[id_func]()

	@requires_grid
	def print_grid_2(self):
		for i in range(self.grid_size ** 4):
			print(*self.grid[i])

def main():
	import sys
	try:
		size = int(sys.argv[1])
	except IndexError:
		size = 3
	grid = Grid(size)
	print(grid.grid_size)
	grid.print_grid()
	print('=' * (size ** 3 + size - 1))
	grid.mix(10)
	grid.print_grid()

if __name__ == '__main__':
	main()
