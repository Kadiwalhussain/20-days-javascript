function calculateAge(){
    const birthYearInput = document.getElementById("birthYear");
    const resultDiv = document.getElementById("result");
    const birthYear = parseInt(birthYearInput.value);
    const currentYear = new Date().getFullYear();

    if (!birthYear) {
        showResult("Please enter a valid birth year.", "error");
        return;
    }
    if (birthYear < 1990 || birthYear > currentYear) {
        showResult("Please enter a birth year between 1990 and the current year."+ currentYear, "error");
        return;
    }

    const age = currentYear - birthYear;

    let message;
    if (age === 0) {
        message = "You are a newborn!";
    }
    else if (age === 1) {
        message = "You are 1 year old!";
    }
    else {
        message = `You are ${age} years old!`;
    }

    showResult(message, "success");

}


function showResult(message , type) {
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = message;
    resultDiv.className = "result " ;

    void resultDiv.offsetWidth
    resultDiv.classList.add("show");
    resultDiv.style.color = type === "error" ? "#dc3545" : "#28a745";

}