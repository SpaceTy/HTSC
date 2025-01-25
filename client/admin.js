document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchAnalysis').addEventListener('click', function() {
        fetch('/get-best-time')
            .then(response => response.json())
            .then(data => {
                displayAnalysis(data);
            })
            .catch(error => {
                console.error('Error fetching analysis:', error);
            });
    });

    function displayAnalysis(data) {
        const adminCalendar = document.getElementById('adminCalendar');
        adminCalendar.innerHTML = '';

        // Create a map to store overlap counts
        const overlapMap = new Map();
        data.forEach(item => {
            const [day, hour] = item.split(', ').map(part => part.split(' ')[1]);
            const key = `${day}-${hour}`;
            overlapMap.set(key, (overlapMap.get(key) || 0) + 1);
        });

        // Determine max overlap for scaling
        const maxOverlap = Math.max(...overlapMap.values(), 0);

        // Generate calendar grid
        for (let hour = 0; hour < 24; hour++) {
            for (let day = 0; day < 7; day++) {
                const slot = document.createElement('div');
                const key = `${day}-${hour}`;
                const overlapCount = overlapMap.get(key) || 0;
                const overlapClass = `overlap-${Math.min(overlapCount, 5)}`; // Cap at 5 for color classes
                slot.classList.add(overlapClass);
                adminCalendar.appendChild(slot);
            }
        }
    }
}); 