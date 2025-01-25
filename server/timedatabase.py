import json
import os

# Path to the JSON file
DATA_FILE = 'available_times.json'

# Load data from the JSON file
def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            # Handle empty or malformed JSON
            return {}
    return {}

# Save data to the JSON file
def save_data(data):
    print(data, "saved")
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

def get_available_time(username):
    data = load_data()
    return data.get(username)

def set_available_time(username, available_time):
    data = load_data()
    # Ensure the available_time is stored in the desired format
    formatted_times = {}
    for day, hours in available_time.items():
        formatted_times[day] = f"{min(hours)}-{max(hours)}"
    data[username] = formatted_times
    save_data(data)

def get_all_available_times():
    return load_data()