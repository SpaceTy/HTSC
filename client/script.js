document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const selectedSlots = new Set();
    let isSelecting = false;
    let startSlot = null;

    // Generate calendar grid
    for (let hour = 0; hour < 24; hour++) {
        for (let day = 0; day < 7; day++) {
            const slot = document.createElement('div');
            slot.dataset.day = day;
            slot.dataset.hour = hour;
            slot.addEventListener('mousedown', function() {
                isSelecting = true;
                startSlot = slot;
                toggleSlotSelection(slot);
            });
            slot.addEventListener('mouseover', function() {
                if (isSelecting && startSlot) {
                    selectRange(startSlot, slot);
                }
            });
            slot.addEventListener('mouseup', function() {
                isSelecting = false;
                startSlot = null;
            });
            // Prevent default drag behavior
            slot.addEventListener('dragstart', function(event) {
                event.preventDefault();
            });
            calendar.appendChild(slot);
        }
    }

    document.addEventListener('mouseup', function() {
        isSelecting = false;
        startSlot = null;
    });

    function toggleSlotSelection(slot) {
        const slotId = `${slot.dataset.day}-${slot.dataset.hour}`;
        if (selectedSlots.has(slotId)) {
            selectedSlots.delete(slotId);
            slot.classList.remove('selected');
        } else {
            selectedSlots.add(slotId);
            slot.classList.add('selected');
        }
    }

    function selectRange(start, end) {
        const startDay = parseInt(start.dataset.day);
        const startHour = parseInt(start.dataset.hour);
        const endDay = parseInt(end.dataset.day);
        const endHour = parseInt(end.dataset.hour);

        if (startDay === endDay) {
            const minHour = Math.min(startHour, endHour);
            const maxHour = Math.max(startHour, endHour);
            for (let hour = minHour; hour <= maxHour; hour++) {
                const slotId = `${startDay}-${hour}`;
                const slot = document.querySelector(`[data-day="${startDay}"][data-hour="${hour}"]`);
                if (slot && !selectedSlots.has(slotId)) {
                    selectedSlots.add(slotId);
                    slot.classList.add('selected');
                }
            }
        }
    }

    document.getElementById('submitTimes').addEventListener('click', function() {
        const availableTimes = Array.from(selectedSlots).reduce((acc, slot) => {
            const [day, hour] = slot.split('-');
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(hour);
            return acc;
        }, {});

        const username = prompt("Please enter your username:");

        if (username) {
            fetch('/send-time', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ availableTimes, username })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('response').innerText = data.status;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert("Username is required to submit times.");
        }
    });

    document.getElementById('getBestTime').addEventListener('click', function() {
        fetch('/get-best-time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('response').innerText = `Best Time: ${data.bestTime}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});