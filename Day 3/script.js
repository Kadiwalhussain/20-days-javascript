function calculateGrade() {
    const marks = parseInt(document.getElementById('marks').value);
    const resultDiv = document.getElementById('result');
    let grade;
    let className;

    if (isNaN(marks) || marks < 0 || marks > 100) {
        grade = 'Please enter a valid mark between 0 and 100';
        className = 'fail';
    } else {
        if (marks >= 90) {
            grade = 'A+ (Outstanding)';
            className = 'success';
        } else if (marks >= 80) {
            grade = 'A (Excellent)';
            className = 'success';
        } else if (marks >= 70) {
            grade = 'B (Very Good)';
            className = 'success';
        } else if (marks >= 60) {
            grade = 'C (Good)';
            className = 'success';
        } else if (marks >= 50) {
            grade = 'D (Pass)';
            className = 'success';
        } else {
            grade = 'F (Fail)';
            className = 'fail';
        }
    }

    resultDiv.textContent = `Grade: ${grade}`;
    resultDiv.className = className;
    resultDiv.style.display = 'block';
} 