from flask import Flask, jsonify
from flask_cors import CORS

# configuration
DEBUG = False

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app)

# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
	return jsonify('ping!')

if __name__ == '__main__':
	app.run()
