from timedatabase import get_all_available_times
from collections import defaultdict

def find_best_time():
    available_times = get_all_available_times()
    time_overlap = defaultdict(int)

    # Iterate over each user's available times
    for user_times in available_times.values():
        for day, time_range in user_times.items():
            start_hour, end_hour = map(int, time_range.split('-'))
            for hour in range(start_hour, end_hour + 1):
                time_overlap[(day, hour)] += 1

    # Find the time frames with the most overlap
    max_overlap = max(time_overlap.values(), default=0)
    best_times = [(day, hour) for (day, hour), count in time_overlap.items() if count == max_overlap]

    return best_times

def get_best_time():
    best_times = find_best_time()
    # Format the output for better readability
    formatted_times = [f"Day {day}, Hour {hour}" for day, hour in best_times]
    return formatted_times 