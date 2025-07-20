function calculateGrade (){
    const marks = parseFloat(document.getElementById('marks').value);
    const resultDiv = document.getElementById('result');
    let grade;
    let className;

    if (isNaN(marks) || marks < 0 || marks > 100) {
        grade = 'Please enter a valid mark between 0 and 100.';
        className = 'fail';

    } else {
        if (marks >= 90) {
            grade = 'A+ (outsending)';
            className = 'Success';
        } else if(marks >= 80) {
            grade = 'A (excellent)';
            className = 'Success';
        }else if (marks >= 70) {
            grade = 'B- (very good)';
            className = 'Success';
        }else if (marks >= 60){
            grade = 'C (good)';
            className = 'Success';
        }else if (marks >= 50) {
            grade = 'D (satisfactory)';
        }else  {
            grade = 'F (fail)';
            className = 'fail'; 
        }
        

    }

    resultDiv.textContent = `Grade: ${grade}`;
    resultDiv.className = className;
    resultDiv.style.display = 'block';
}

