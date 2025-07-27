// DOM Elements
const heightSlider = document.getElementById('height');
const weightSlider = document.getElementById('weight');
const heightValue = document.getElementById('height-value');
const weightValue = document.getElementById('weight-value');
const calculateBtn = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');

// BMI History Array
let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];

// Update display values for sliders
heightSlider.addEventListener('input', () => {
    heightValue.textContent = `${heightSlider.value} cm`;
});

weightSlider.addEventListener('input', () => {
    weightValue.textContent = `${weightSlider.value} kg`;
});

// Calculate BMI and determine health status
function calculateBMI(height, weight) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
}

function getHealthStatus(bmi) {
    if (bmi < 18.5) return { status: 'Underweight', icon: '⚠️', class: 'underweight' };
    if (bmi >= 18.5 && bmi <= 24.9) return { status: 'Healthy', icon: '✅', class: 'healthy' };
    if (bmi >= 25 && bmi <= 29.9) return { status: 'Overweight', icon: '⚠️', class: 'overweight' };
    return { status: 'Obese', icon: '❌', class: 'obese' };
}

// Save BMI calculation to history
function saveBMIToHistory(height, weight, bmi, status) {
    const date = new Date().toLocaleString();
    const record = {
        date,
        height,
        weight,
        bmi,
        status
    };
    
    bmiHistory.unshift(record);
    if (bmiHistory.length > 10) bmiHistory.pop(); // Keep only last 10 records
    localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    historyList.innerHTML = bmiHistory.map(record => `
        <div class="history-item ${getHealthStatus(record.bmi).class}">
            <strong>${record.date}</strong><br>
            Height: ${record.height}cm, Weight: ${record.weight}kg<br>
            BMI: ${record.bmi} - ${record.status}
        </div>
    `).join('');
}









// Calculate button click handler
calculateBtn.addEventListener('click', () => {
    const height = parseInt(heightSlider.value);
    const weight = parseInt(weightSlider.value);
    const bmi = calculateBMI(height, weight);
    const healthStatus = getHealthStatus(bmi);
    
    // Update result display
    resultDiv.className = `result ${healthStatus.class}`;
    resultDiv.innerHTML = `
        <h3>Your BMI is ${bmi}</h3>
        <p>${healthStatus.icon} You are ${healthStatus.status}</p>
    `;
    
    // Save to history
    saveBMIToHistory(height, weight, bmi, healthStatus.status);
});

// Initial history display
updateHistoryDisplay(); 