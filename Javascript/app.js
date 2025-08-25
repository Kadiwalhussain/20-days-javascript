// Node.js version - run with: node console-practice.js
console.log("=== Practice Exercise 1.1: Console Interaction ===");

// Basic arithmetic operation
const arithmeticResult = 4 + 10;
console.log("4 + 10 =", arithmeticResult); // Expected: 14

// String output with proper quoting
const studentName = "Your Name Here"; // Replace with actual name
console.log("Student name:", studentName);

// Type verification - demonstrates JavaScript's dynamic typing
console.log("Type of arithmetic result:", typeof arithmeticResult); // Expected: "number"
console.log("Type of student name:", typeof studentName); // Expected: "string"

// Demonstrate different console methods as mentioned in text
const sampleData = [
    { Method: "console.log", Purpose: "Basic output" },
    { Method: "console.table", Purpose: "Tabular display" },
    { Method: "console.error", Purpose: "Error highlighting" }
];

console.table(sampleData); // Creates formatted table output
console.error("This is a sample error message for demonstration");

// Input validation for learning purposes
function validateConsoleInput(input) {
    if (typeof input === 'undefined') {
        console.error("Error: Input cannot be undefined");
        return false;
    }
    console.log("✅ Input validation passed for:", input);
    return true;
}

validateConsoleInput(arithmeticResult);
validateConsoleInput(studentName);
