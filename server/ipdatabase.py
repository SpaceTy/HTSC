import json
import os

# Path to the JSON file
IP_DATA_FILE = 'ip_database.json'

# Load data from the JSON file
def load_ip_data():
    if os.path.exists(IP_DATA_FILE):
        try:
            with open(IP_DATA_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            # Handle empty or malformed JSON
            return {}
    return {}

# Save data to the JSON file
def save_ip_data(data):
    with open(IP_DATA_FILE, 'w') as file:
        json.dump(data, file)

def get_username(ip):
    data = load_ip_data()
    return data.get(ip)

def set_username(username, ip):
    data = load_ip_data()
    data[ip] = username
    save_ip_data(data) 