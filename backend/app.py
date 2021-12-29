from flask import Flask, jsonify, request

from sudoku import Sudoku
from solver import solve_sudoku

app = Flask(__name__)

@app.route('/api/generate', methods=['GET'])
def sudoku_generation():
    data = request.get_json()
    if data.get('size') not in range(2, 6) or data.get('dif') not in range(0, 6):
        return jsonify({'error': 404}), 404

    try:
        matrix = Sudoku(data.get('size', 3), data.get('dif', 4))
    except ValueError:
        return jsonify({'error': 404}), 404

    return jsonify({'matrix': matrix.masked_grid}), 200

@app.route('/api/numsol', methods=['GET'])
def check_solutions():
    data = request.get_json()
    solutions = 0
    if data.get('size') not in range(2, 6):
        return jsonify({'error': 404}), 404

    try:
        for _ in solve_sudoku((data.get('size'), data.get('size')), data.get('matrix')):
            solutions += 1
            if solutions > 100:
                break
    except:
        return jsonify({'error': 404}), 404

    return jsonify({'sol': solutions}), 200

if __name__ == '__main__':
  app.run(debug = True)

