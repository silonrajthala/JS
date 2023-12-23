let currentExpression = ''; // To store the current expression

const display = document.getElementById('display');
function backSpace() {
    display.textContent = display.textContent.slice(0, -1);
}

function appendNumber(number) {
    
    if (display.scrollWidth <= display.clientWidth) {
        display.textContent += number; // Append number to the display
        currentExpression += number; // Append number to the expression
    }
}

function appendOperator(operator) {
    if (display.scrollWidth <= display.clientWidth) {
        display.textContent += operator; // Append operator to the display
        currentExpression += operator; // Append operator to the expression
    }
}

function appendDecimal(decimal) {
    if (display.scrollWidth <= display.clientWidth) {
        display.textContent += decimal; // Append decimal point to the display
        currentExpression += decimal; // Append decimal point to the expression
    }
}

function clearDisplay() {
    display.textContent = '';
    currentExpression = ''; // Clear the current expression
}

function calculateResult() {
    try {
        const result = eval(currentExpression);
        display.textContent = result; // Display the result
        currentExpression = result.toString(); // Store the result as the current expression
    } catch (error) {
        // Handle errors from the expression evaluation
        display.textContent = 'Error';
        currentExpression = '';
    }
}
