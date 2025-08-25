function calculateAge() {
    const birthYearInput = document.getElementById('birthYear');
    const resultDiv = document.getElementById('result');
    const birthYear = parseInt(birthYearInput.value);
    const currentYear = new Date().getFullYear();

    // Input validation
    if (!birthYear) {
        showResult('Please enter a birth year!', 'error');
        return;
    }

    if (birthYear < 1900 || birthYear > currentYear) {
        showResult('Please enter a valid birth year between 1900 and ' + currentYear, 'error');
        return;
    }

    // Calculate age
    const age = currentYear - birthYear;
    
    // Show result with appropriate message
    let message;
    if (age === 0) {
        message = "Welcome to the world, baby! 👶";
    } else if (age === 1) {
        message = "You are 1 year old! 🎈";
    } else {
        message = `You are ${age} years old! 🎉`;
    }

    showResult(message, 'success');
}

function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = 'result'; // Reset classes
    
    // Force a reflow to restart animation
    void resultDiv.offsetWidth;
    
    resultDiv.classList.add('show');
    resultDiv.style.color = type === 'error' ? '#dc3545' : '#28a745';
} 