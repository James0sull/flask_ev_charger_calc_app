    const carPreset = document.getElementById('car-preset');
    const chargerPreset = document.getElementById('charger-preset');
    const batterySize = document.getElementById('battery-size');
    const chargerSpeed = document.getElementById('charger-speed');
    const electricityRate = document.getElementById('electricity-rate'); // ADDED DOM element
    const startCharge = document.getElementById('start-charge');
    const targetCharge = document.getElementById('target-charge');
    
    const startVal = document.getElementById('start-val');
    const targetVal = document.getElementById('target-val');
    const resultTime = document.getElementById('result-time');
    const resultCost = document.getElementById('result-cost'); // ADDED DOM element
    const mathBreakdown = document.getElementById('math-breakdown');

    carPreset.addEventListener('change', () => {
        if (carPreset.value !== 'custom') {
            batterySize.value = carPreset.value;
        }
        calculateAll();
    });

    chargerPreset.addEventListener('change', () => {
        if (chargerPreset.value !== 'custom') {
            chargerSpeed.value = chargerPreset.value;
        }
        calculateAll();
    });

    batterySize.addEventListener('input', () => {
        carPreset.value = 'custom';
        calculateAll();
    });
    chargerSpeed.addEventListener('input', () => {
        chargerPreset.value = 'custom';
        calculateAll();
    });
    electricityRate.addEventListener('input', () => { // ADDED Event Listener
        calculateAll();
    });

    startCharge.addEventListener('input', () => {
        if (parseInt(startCharge.value) >= parseInt(targetCharge.value)) {
            startCharge.value = parseInt(targetCharge.value) - 5;
        }
        startVal.textContent = startCharge.value + '%';
        calculateAll();
    });

    targetCharge.addEventListener('input', () => {
        if (parseInt(targetCharge.value) <= parseInt(startCharge.value)) {
            targetCharge.value = parseInt(startCharge.value) + 5;
        }
        targetVal.textContent = targetCharge.value + '%';
        calculateAll();
    });

    // MODIFIED: Replaced the entirely client-side calculation function with a backend API call
    async function calculateAll() {
        const capacity = parseFloat(batterySize.value);
        const speed = parseFloat(chargerSpeed.value);
        const rate = parseFloat(electricityRate.value);
        const start = parseInt(startCharge.value);
        const target = parseInt(targetCharge.value);

        // Client-side visual check before posting data
        if (isNaN(capacity) || isNaN(speed) || isNaN(rate) || capacity <= 0 || speed <= 0) {
            resultTime.textContent = "0 hrs";
            resultCost.textContent = "$0.00";
            mathBreakdown.textContent = "Please enter valid values.";
            return;
        }

        try {
            // Post payload directly matches the Option 1 app.py variables
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    battery_capacity: capacity,
                    current_soc: start,
                    target_soc: target,
                    charger_speed: speed,
                    electricity_rate: rate
                })
            });

            const data = await response.json();

            // Convert raw backend charging decimal hours to standard format
            const rawHours = data.charging_time_hours;
            const hours = Math.floor(rawHours);
            const minutes = Math.round((rawHours - hours) * 60);
            
            let timeString = "";
            if (hours > 0) {
                timeString += `${hours} hr${hours > 1 ? 's' : ''} `;
            }
            if (minutes > 0 || hours === 0) {
                timeString += `${minutes} min${minutes > 1 ? 's' : ''}`;
            }

            // Update DOM with results sent back by single server route
            resultTime.textContent = timeString;
            resultCost.textContent = `$${data.total_cost.toFixed(2)}`;
            mathBreakdown.textContent = `Backend Calculation Success: ${data.energy_needed_kwh} kWh processed by server via app.py`;

        } catch (error) {
            console.error("Error communicating with backend API:", error);
            mathBreakdown.textContent = "Failed to connect to backend server.";
        }
    }
    // Run calculation once automatically upon page layout loading
    calculateAll();