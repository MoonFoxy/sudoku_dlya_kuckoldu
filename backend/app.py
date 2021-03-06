import os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from sudoku import Sudoku
from solver import solve_sudoku

app = Flask(__name__)
CORS(app, resources={r"/sudoku/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/sudoku")
@cross_origin()
def hello():
	return jsonify({"message": "Welcome to Sudoku API"})

@app.route('/sudoku/generate', methods=['POST'])
@cross_origin()
def sudoku_generation():
	data = request.get_json()
	size, dif = data.get('size'), data.get('dif')
	if size is not None and dif is not None:
		try:
			size, dif = int(size), int(dif)
		except ValueError:
			return jsonify({ 'error': 'NAN' }), 404

		if size in range(2, 6) and dif in range(0, 6):
			try:
				matrix = Sudoku(size, dif)
			except ValueError:
				return jsonify({ 'error': 'Sudoku generation error' }), 404

			return jsonify({
				'matrix': matrix.masked_grid,
				}), 200

	return jsonify({ 'error': 'Invalid input' }), 404

@app.route('/sudoku/numsol', methods=['POST'])
@cross_origin()
def check_solutions():
	data = request.get_json()
	size, matrix = data.get('size'), data.get('matrix')
	if size is not None and matrix is not None:
		try:
			size = int(size)
		except ValueError:
			return jsonify({ 'error': 'NAN' }), 404

		solutions = 0
		if size in range(2, 6):
			try:
				for _ in solve_sudoku((size, size), matrix):
					solutions += 1
					if solutions > 100:
						break
			except:
				return jsonify({ 'error': 'Counting error' }), 404

			return jsonify({ 'sol': solutions }), 200

	return jsonify({ 'error': 'Invalid input' }), 404

if __name__ == '__main__':
  app.run(debug = os.environ['DEBUG'] == 'True')
