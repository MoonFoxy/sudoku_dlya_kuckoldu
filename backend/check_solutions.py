
def solutions(string, column):
    free_count = 0
    num_list = []
    possible_num = []
    for i in range(string, n):
        for j in range(column, n):
            if matrix[i][j] == 0:
                free_count += 1
            else:
                possible_num.append(matrix[i][j])
                for k in range(n*n): #поиск по строке
                    if matrix[i][k] != 0 and (matrix[i][k] not in possible_num)
                        possible_num -= 1
                    if matrix[k][j] != 0 and (matrix[i][k] not in possible_num):
                        possible_num -= 1
    if free_count == 0:
        return
    else:
        solutions_count = 1
        for i in possible_num:
            solutions_count *=i*free_count
        return solutions_count

solutions_count = 1
max_string = n*n - n  # начало нижних квадратов
current_string = 0    # начало текущего квадрата
max_column = n*n - n  # начало правых столбцов из квадратов
current_column = 0    # начало текущего квадрата
while current_string <= max_string and current_column <= max_column:
    solutions_count *= solutions(current_string, current_column)
    current_string += n
    current_column += n
    if solutions_count <= 0:
        solutions_count = 0
        print("Нет решений!")
        break
