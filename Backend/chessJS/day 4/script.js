const heightSlider = document.getElementById('height');
const weightSlider = document.getElementById('weight');
const heightValue = document.getElementById('height-value');
const weightValue = document.getElementById('weight-value');
const calculateBtn = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');


let binHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];

heightSlider.addEventListener('input', () => {
    heightValue.textContent = ${heightSlider.value} cm;
});