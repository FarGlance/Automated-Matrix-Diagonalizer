// ===== DOM Elements =====
const matrixGrid = document.getElementById('matrix-grid');
const sizeButtons = document.querySelectorAll('.size-btn');
const diagonalizeBtn = document.getElementById('diagonalize-btn');
const clearBtn = document.getElementById('clear-btn');
const exampleBtn = document.getElementById('example-btn');
const resultsSection = document.getElementById('results-section');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const notDiagonalizable = document.getElementById('not-diagonalizable');
const successResults = document.getElementById('success-results');

// ===== State =====
let currentSize = 3;

// ===== Example Matrices =====
const examples = {
    2: [
        [4, 1],
        [2, 3]
    ],
    3: [
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3]
    ],
    4: [
        [4, 0, 0, 0],
        [0, 3, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 1]
    ],
    5: [
        [1, 0, 0, 0, 0],
        [0, 2, 0, 0, 0],
        [0, 0, 3, 0, 0],
        [0, 0, 0, 4, 0],
        [0, 0, 0, 0, 5]
    ]
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createMatrixGrid(currentSize);
    setupEventListeners();
});

// ===== Event Listeners Setup =====
function setupEventListeners() {
    // Size buttons
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = parseInt(btn.dataset.size);
            if (size !== currentSize) {
                currentSize = size;
                updateActiveSizeButton(btn);
                createMatrixGrid(size);
                hideResults();
            }
        });
    });

    // Diagonalize button
    diagonalizeBtn.addEventListener('click', handleDiagonalize);

    // Clear button
    clearBtn.addEventListener('click', () => {
        clearMatrix();
        hideResults();
    });

    // Example button
    exampleBtn.addEventListener('click', loadExample);
}

// ===== Matrix Grid Functions =====
function createMatrixGrid(size) {
    matrixGrid.innerHTML = '';
    matrixGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'decimal';
            input.placeholder = '0';
            input.dataset.row = i;
            input.dataset.col = j;
            input.id = `cell-${i}-${j}`;
            
            // Navigate with arrow keys
            input.addEventListener('keydown', handleKeyNavigation);
            
            // Validate input - only allow numbers
            input.addEventListener('input', handleInputValidation);
            
            // Validate on blur (when leaving the field)
            input.addEventListener('blur', handleInputBlur);
            
            matrixGrid.appendChild(input);
        }
    }
}

// Validate input as user types - only allow valid number characters
function handleInputValidation(e) {
    const input = e.target;
    let value = input.value;
    
    // Allow: digits, one decimal point, one minus sign at start
    // Remove any invalid characters
    let cleaned = '';
    let hasDecimal = false;
    let hasSign = false;
    
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        
        // Allow minus sign only at the start
        if (char === '-' && i === 0 && !hasSign) {
            cleaned += char;
            hasSign = true;
        }
        // Allow digits
        else if (char >= '0' && char <= '9') {
            cleaned += char;
        }
        // Allow one decimal point
        else if (char === '.' && !hasDecimal) {
            cleaned += char;
            hasDecimal = true;
        }
    }
    
    // Update the input if we cleaned anything
    if (cleaned !== value) {
        input.value = cleaned;
    }
}

// Clean up on blur - ensure valid number format
function handleInputBlur(e) {
    const input = e.target;
    let value = input.value.trim();
    
    // Handle edge cases
    if (value === '' || value === '-' || value === '.') {
        input.value = '';
        return;
    }
    
    // Try to parse as a number
    const num = parseFloat(value);
    if (isNaN(num)) {
        input.value = '';
    } else {
        // Format nicely (remove trailing zeros and unnecessary decimals)
        input.value = num.toString();
    }
}

function handleKeyNavigation(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    let targetId = null;
    
    switch(e.key) {
        case 'ArrowUp':
            if (row > 0) targetId = `cell-${row-1}-${col}`;
            break;
        case 'ArrowDown':
            if (row < currentSize - 1) targetId = `cell-${row+1}-${col}`;
            break;
        case 'ArrowLeft':
            if (col > 0) targetId = `cell-${row}-${col-1}`;
            break;
        case 'ArrowRight':
            if (col < currentSize - 1) targetId = `cell-${row}-${col+1}`;
            break;
        case 'Enter':
            e.preventDefault();
            if (col < currentSize - 1) {
                targetId = `cell-${row}-${col+1}`;
            } else if (row < currentSize - 1) {
                targetId = `cell-${row+1}-0`;
            } else {
                handleDiagonalize();
                return;
            }
            break;
        default:
            return;
    }
    
    if (targetId) {
        e.preventDefault();
        document.getElementById(targetId)?.focus();
    }
}

function getMatrixValues() {
    const matrix = [];
    for (let i = 0; i < currentSize; i++) {
        const row = [];
        for (let j = 0; j < currentSize; j++) {
            const input = document.getElementById(`cell-${i}-${j}`);
            const value = parseFloat(input.value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

function clearMatrix() {
    const inputs = matrixGrid.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
}

function loadExample() {
    const example = examples[currentSize];
    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            const input = document.getElementById(`cell-${i}-${j}`);
            input.value = example[i][j];
        }
    }
    hideResults();
}

function updateActiveSizeButton(activeBtn) {
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// ===== API Functions =====
async function handleDiagonalize() {
    const matrix = getMatrixValues();
    
    // Show loading state
    diagonalizeBtn.classList.add('loading');
    diagonalizeBtn.disabled = true;
    
    try {
        const response = await fetch('/api/diagonalize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matrix })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'An error occurred');
            return;
        }
        
        displayResults(data);
        
    } catch (error) {
        showError('Failed to connect to the server');
    } finally {
        diagonalizeBtn.classList.remove('loading');
        diagonalizeBtn.disabled = false;
    }
}

// ===== Display Functions =====
function displayResults(data) {
    hideResults();
    resultsSection.classList.remove('hidden');
    
    if (!data.diagonalizable) {
        notDiagonalizable.classList.remove('hidden');
        return;
    }
    
    successResults.classList.remove('hidden');
    
    // Display matrices
    renderMatrix('matrix-P', data.P);
    renderMatrix('matrix-D', data.D);
    renderMatrix('matrix-verification', data.verification);
    renderMatrix('matrix-D-verify', data.D);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderMatrix(containerId, matrix) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const content = document.createElement('div');
    content.className = 'matrix-content';
    // Add data-size attribute for CSS grid columns
    content.setAttribute('data-size', matrix.length);
    
    matrix.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';
            cellDiv.textContent = formatNumber(cell);
            rowDiv.appendChild(cellDiv);
        });
        
        content.appendChild(rowDiv);
    });
    
    container.appendChild(content);
}

function formatNumber(value) {
    if (typeof value === 'string') {
        // Complex number
        return value;
    }
    
    // Format number with appropriate precision
    if (Number.isInteger(value)) {
        return value.toString();
    }
    
    // Check if it's very close to an integer
    if (Math.abs(value - Math.round(value)) < 0.0001) {
        return Math.round(value).toString();
    }
    
    return value.toFixed(4).replace(/\.?0+$/, '');
}

function showError(message) {
    hideResults();
    resultsSection.classList.remove('hidden');
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
}

function hideResults() {
    errorMessage.classList.add('hidden');
    notDiagonalizable.classList.add('hidden');
    successResults.classList.add('hidden');
}
