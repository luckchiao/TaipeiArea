from flask import Flask, jsonify, send_from_directory
import requests

def current_gym_data():
    res = requests.post('http://booking.tpsc.sporetrofit.com/Home/loadLocationPeopleNum')
    gym_data = res.json()
    return gym_data

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.' ,'index.html')

@app.route('/<path:path>')
def static_folder(path):
    pass

@app.route('/gym')
def gym():
    gym_data = current_gym_data()
    return jsonify(gym_data)

if __name__ == '__main__':
    app.run(debug=True)