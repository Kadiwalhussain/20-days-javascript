/*
External JavaScript File: app.js
=====================================
Purpose: Demonstrate external file linking and organization
Author: Student Name
Created: Current Date
Version: 1.0

This file demonstrates:
- External JavaScript file structure
- Proper commenting practices
- Error handling and validation
- Modern JavaScript features with ES5 fallbacks
*/

// Immediately Invoked Function Expression (IIFE) to avoid global namespace pollution
(function() {
    'use strict'; // Enable strict mode for better error checking

    console.log("=== Practice Exercise 1.3: External File Linking ===");
    console.log("✅ External JavaScript file (app.js) loaded successfully!");

    // Demonstrate file loading timestamp
    const loadTimestamp = new Date().toISOString();
    console.log("File loaded at:", loadTimestamp);

    // Show different JavaScript data types as mentioned in text
    const examples = {
        string: "This content comes from app.js",
        number: 42,
        boolean: true,
        array: [1, 2, 3, 4, 5],
        object: { language: "JavaScript", year: 1995 }
    };

    // Iterate through examples with error handling
    Object.keys(examples).forEach(function(key) {
        try {
            const value = examples[key];
            const type = typeof value;
            console.log(`${key.toUpperCase()}: ${JSON.stringify(value)} (Type: ${type})`);
        } catch (error) {
            console.error(`Error processing ${key}:`, error.message);
        }
    });

    // Demonstrate table output as mentioned in text
    const fileInfo = [
        { Property: "Filename", Value: "app.js" },
        { Property: "Type", Value: "External JavaScript" },
        { Property: "Purpose", Value: "Exercise 1.3 demonstration" }
    ];

    console.table(fileInfo);

    // Function to validate external file linking
    function validateExternalLinking() {
        // Check if we're running in browser environment
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            console.log("✅ Running in browser environment");
            console.log("Document title:", document.title || "No title set");
            return true;
        } else if (typeof global !== 'undefined') {
            console.log("✅ Running in Node.js environment");
            return true;
        } else {
            console.error("❌ Unknown execution environment");
            return false;
        }
    }

    validateExternalLinking();

    // Export function for potential Node.js usage
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { validateExternalLinking, examples };
    }

    console.log("🎯 External file execution completed!");

})();

// Additional utility functions for demonstration
function demonstrateRandomNumbers() {
    console.log("\n=== Random Number Demonstration (from text) ===");

    const randomDecimal = Math.random();
    const randomPercentage = Math.random() * 100;
    const randomInteger = Math.floor(Math.random() * 100);

    console.log("Random decimal (0-1):", randomDecimal.toFixed(4));
    console.log("Random percentage (0-100):", randomPercentage.toFixed(2));
    console.log("Random integer (0-99):", randomInteger);
}

// Call demonstration function
demonstrateRandomNumbers();
