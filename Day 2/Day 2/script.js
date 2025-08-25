function checkWaterStatus() {
    // Ask user when they last drank water
    const lastDrankInput = prompt("How many hours ago did you last drink water? (Enter a number)");
    
    // Convert input to number
    const hoursSinceLastDrink = parseFloat(lastDrankInput);
    
    // Validate input
    if (isNaN(hoursSinceLastDrink) || hoursSinceLastDrink < 0) {
        document.getElementById('message').innerHTML = 
            "Please enter a valid positive number for hours.";
        return;
    }

    let message;
    let messageColor;

    // Apply conditional logic based on hours
    if (hoursSinceLastDrink <= 1) {
        message = "Great job! You're well hydrated. Remember to drink water again in the next hour.";
        messageColor = "#43a047"; // green
    } else if (hoursSinceLastDrink <= 2) {
        message = "You might want to consider having a glass of water soon.";
        messageColor = "#ffa000"; // amber
    } else if (hoursSinceLastDrink <= 4) {
        message = "It's been a while! Please drink some water now to stay healthy.";
        messageColor = "#f57c00"; // orange
    } else {
        message = "⚠️ You should drink water immediately! Long periods without water can be harmful to your health.";
        messageColor = "#d32f2f"; // red
    }

    // Update the message with recommendation
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = message;
    messageElement.style.background = `${messageColor}20`; // Using 20% opacity of the color
    messageElement.style.color = messageColor;
} 