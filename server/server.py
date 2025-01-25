import os
from flask import Flask, request, jsonify, send_from_directory
from analysis import get_best_time
from timedatabase import set_available_time

app = Flask(__name__, static_folder=os.path.join('..', 'client'), static_url_path='')

@app.route('/')
def serve_client():
    print("Serving index.html")
    return app.send_static_file('index.html')

@app.route('/admin')
def serve_admin():
    print("Serving admin.html")
    return app.send_static_file('admin.html')

@app.route('/send-time', methods=['POST'])
def send_time():
    username = request.json.get('username')
    if not username:
        return jsonify({"status": "Username required"}), 400
    
    available_time = request.json.get('availableTimes')
    print(available_time)  # Example: {"0": ["7", "8", "9"]}
    set_available_time(username, available_time)
    return jsonify({"status": "success"}), 200

@app.route('/get-best-time', methods=['GET'])
def get_best_time_endpoint():
    best_times = get_best_time()
    return jsonify(best_times), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080) 