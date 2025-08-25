// Mood journal data storage
let moodEntries = [];
let selectedMood = null;
let selectedMoodLabel = null;

// DOM elements
const dateInput = document.getElementById('date');
const moodOptions = document.querySelectorAll('.mood-option');
const reasonTextarea = document.getElementById('reason');
const moodForm = document.getElementById('moodForm');
const entriesList = document.getElementById('entriesList');
const moodChart = document.getElementById('moodChart');

// Initialize app
function init() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Load saved entries from localStorage
    loadEntries();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update displays
    updateEntriesDisplay();
    updateMoodChart();
}

// Setup all event listeners
function setupEventListeners() {
    // Mood selection
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selection
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            option.classList.add('selected');
            selectedMood = option.dataset.mood;
            selectedMoodLabel = option.dataset.label;
        });
    });

    // Form submission
    moodForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const date = dateInput.value;
    const reason = reasonTextarea.value.trim();

    // Validation
    if (!selectedMood) {
        alert('Please select your mood! 😊');
        return;
    }

    if (!reason) {
        alert('Please tell us why you feel that way! 💭');
        return;
    }

    // Check if entry for this date already exists
    const existingEntryIndex = moodEntries.findIndex(entry => entry.date === date);
    
    if (existingEntryIndex !== -1) {
        if (confirm('An entry for this date already exists. Do you want to update it?')) {
            moodEntries[existingEntryIndex] = {
                date,
                mood: selectedMood,
                moodLabel: selectedMoodLabel,
                reason,
                timestamp: new Date().toISOString()
            };
        } else {
            return;
        }
    } else {
        // Create new entry
        const newEntry = {
            id: Date.now(),
            date,
            mood: selectedMood,
            moodLabel: selectedMoodLabel,
            reason,
            timestamp: new Date().toISOString()
        };

        moodEntries.unshift(newEntry); // Add to beginning of array
    }

    // Save to localStorage
    saveEntries();

    // Update displays
    updateEntriesDisplay();
    updateMoodChart();

    // Reset form
    resetForm();

    // Show success message
    showSuccessMessage();
}

// Reset form to initial state
function resetForm() {
    moodOptions.forEach(opt => opt.classList.remove('selected'));
    reasonTextarea.value = '';
    selectedMood = null;
    selectedMoodLabel = null;
    
    // Set tomorrow's date for next entry
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
}

// Show success message
function showSuccessMessage() {
    const btn = document.querySelector('.submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Entry Added! ✅';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

// Update entries display
function updateEntriesDisplay() {
    if (moodEntries.length === 0) {
        entriesList.innerHTML = `
            <div class="no-entries">
                <span class="no-entries-emoji">📝</span>
                <p>No journal entries yet. Start by adding your first mood entry above!</p>
            </div>
        `;
        return;
    }

    entriesList.innerHTML = moodEntries.map(entry => `
        <div class="entry-card">
            <div class="entry-header">
                <span class="entry-date">🗓 ${formatDate(entry.date)}</span>
                <div>
                    <span class="entry-mood">${entry.mood}</span>
                    <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
                </div>
            </div>
            <div class="entry-text">
                <strong>Mood:</strong> ${entry.moodLabel} ${entry.mood}<br>
                <strong>Reason:</strong> ${entry.reason}
            </div>
        </div>
    `).join('');
}

// Update mood statistics chart
function updateMoodChart() {
    const moodCounts = {
        '😢': { count: 0, label: 'Very Sad' },
        '😞': { count: 0, label: 'Sad' },
        '😐': { count: 0, label: 'Neutral' },
        '🙂': { count: 0, label: 'Happy' },
        '😊': { count: 0, label: 'Very Happy' }
    };

    // Count moods
    moodEntries.forEach(entry => {
        if (moodCounts[entry.mood]) {
            moodCounts[entry.mood].count++;
        }
    });

    // Generate chart HTML
    moodChart.innerHTML = Object.entries(moodCounts).map(([emoji, data]) => `
        <div class="chart-item">
            <span class="chart-emoji">${emoji}</span>
            <div class="chart-count">${data.count}</div>
            <div class="chart-label">${data.label}</div>
        </div>
    `).join('');
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        moodEntries = moodEntries.filter(entry => entry.id !== id);
        saveEntries();
        updateEntriesDisplay();
        updateMoodChart();
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Save entries to localStorage
function saveEntries() {
    localStorage.setItem('moodJournalEntries', JSON.stringify(moodEntries));
}

// Load entries from localStorage
function loadEntries() {
    const saved = localStorage.getItem('moodJournalEntries');
    if (saved) {
        moodEntries = JSON.parse(saved);
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', init); 