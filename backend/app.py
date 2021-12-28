from flask import Flask, abort, request
from flask_restful import Api
import random

from sudoku import Sudoku
from solver import solve_sudoku

app = Flask(__name__)
api = Api(app)

@app.route('/api/generate', methods=['GET'])
def matrix_gen():
    data = request.get_json()
    try:		 
        matrx = Sudoku(data.size, data.dif)
    except ValueError:
        abort(404)
    return matrx.masked_grid, 200
    # response = requests.post(url, json={"user": user,"pass": password})

@app.route('/api/numsol', methods=['GET'])
def check_sol():
    pop = 0
    data = request.get_json()
    try:
        for solution in solve_sudoku((data.size, data.size), data.mat):
            pop += 1
            if pop > 100:
                break
    except:
        abort(404)
    return pop, 200
    # response = requests.post(url, json={"user": user,"pass": password})

if __name__ == '__main__':
  app.run(debug=True)

