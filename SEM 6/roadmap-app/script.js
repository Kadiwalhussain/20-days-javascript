document.addEventListener('DOMContentLoaded', () => {
    const dashboardView = document.getElementById('dashboard-view');
    const detailView = document.getElementById('detail-view');
    const subjectList = document.getElementById('subject-list');
    const detailContent = document.getElementById('detail-content');
    const backBtn = document.getElementById('back-btn');
    const detailTitle = document.getElementById('detail-title');
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const timerBtn = document.getElementById('timer-btn');
    const statsBtn = document.getElementById('stats-btn');
    const timerModal = document.getElementById('timer-modal');
    const notesModal = document.getElementById('notes-modal');
    const statsModal = document.getElementById('stats-modal');

    // Load data from local storage
    let progress = JSON.parse(localStorage.getItem('sem6_progress')) || {};
    let notes = JSON.parse(localStorage.getItem('sem6_notes')) || {};
    let studyTime = parseInt(localStorage.getItem('sem6_study_time')) || 0;
    let studyStreak = parseInt(localStorage.getItem('sem6_streak')) || 0;
    let lastStudyDate = localStorage.getItem('sem6_last_study_date') || null;
    let currentFilter = 'all';
    let currentSearch = '';

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Check study streak
    checkStudyStreak();

    // Initialize Dashboard
    function renderDashboard() {
        subjectList.innerHTML = '';
        let filteredSubjects = semesterData;

        // Apply search filter
        if (currentSearch) {
            const searchLower = currentSearch.toLowerCase();
            filteredSubjects = semesterData.filter(subject => {
                const matchesSubject = subject.name.toLowerCase().includes(searchLower) ||
                    subject.code.toLowerCase().includes(searchLower) ||
                    subject.description.toLowerCase().includes(searchLower);
                
                if (matchesSubject) return true;

                // Check modules and topics
                return subject.modules.some(module => {
                    if (module.title.toLowerCase().includes(searchLower)) return true;
                    return module.topics.some(topic => topic.toLowerCase().includes(searchLower));
                });
            });
        }

        // Apply status filter
        if (currentFilter !== 'all') {
            filteredSubjects = filteredSubjects.filter(subject => {
                const totalTopics = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
                const completedTopics = countCompletedTopics(subject);
                const percentage = totalTopics === 0 ? 0 : (completedTopics / totalTopics) * 100;

                if (currentFilter === 'completed') {
                    return percentage === 100;
                } else if (currentFilter === 'in-progress') {
                    return percentage > 0 && percentage < 100;
                }
                return true;
            });
        }

        if (filteredSubjects.length === 0) {
            subjectList.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="font-size: 1.2rem;">No subjects found matching your search.</p>
                </div>
            `;
            return;
        }

        filteredSubjects.forEach((subject, index) => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.onclick = () => showSubjectDetail(subject);

            const totalTopics = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            const completedTopics = countCompletedTopics(subject);
            const percentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

            card.innerHTML = `
                <span class="subject-code">${subject.code}</span>
                <h2 class="subject-title">${subject.name}</h2>
                <p class="subject-desc">${subject.description}</p>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">
                    <span>${percentage}% Complete</span>
                    <span>${completedTopics}/${totalTopics} Topics</span>
                </div>
            `;
            subjectList.appendChild(card);
        });

        updateOverallProgress();
    }

    function countCompletedTopics(subject) {
        let count = 0;
        subject.modules.forEach(module => {
            module.topics.forEach((topic, index) => {
                const topicId = `${module.id}-t${index}`;
                if (progress[topicId]) {
                    count++;
                }
            });
        });
        return count;
    }

    function showSubjectDetail(subject) {
        dashboardView.style.display = 'none';
        detailView.classList.add('active');

        detailTitle.innerHTML = `
            <span style="color: var(--accent-color);">${subject.code}</span> ${subject.name}
        `;

        detailContent.innerHTML = '';
        subject.modules.forEach((module, moduleIndex) => {
            const moduleCard = document.createElement('div');
            moduleCard.className = 'module-card';
            moduleCard.style.animationDelay = `${moduleIndex * 0.1}s`;

            const topicsHtml = module.topics.map((topic, index) => {
                const topicId = `${module.id}-t${index}`;
                const isChecked = progress[topicId] ? 'checked' : '';
                const topicNotes = notes[topicId] || '';

                return `
                    <div class="topic-item">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="${topicId}" class="topic-checkbox" ${isChecked} 
                                onchange="toggleTopic('${topicId}')">
                            <label for="${topicId}" class="custom-checkbox"></label>
                        </div>
                        <label for="${topicId}" class="topic-text">${topic}</label>
                        <button class="notes-btn" onclick="openNotes('${topicId}', '${topic.replace(/'/g, "\\'")}')" title="Add Notes">
                            <i class="fas fa-sticky-note"></i>
                        </button>
                    </div>
                `;
            }).join('');

            moduleCard.innerHTML = `
                <div class="module-header">
                    <h3 class="module-title">${module.title}</h3>
                    <span class="module-hours">${module.hours} Hrs</span>
                </div>
                <div class="topic-list">
                    ${topicsHtml}
                </div>
            `;
            detailContent.appendChild(moduleCard);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Global function to handle checkbox toggles
    window.toggleTopic = function (topicId) {
        if (progress[topicId]) {
            delete progress[topicId];
        } else {
            progress[topicId] = true;
            updateStudyDate();
        }
        localStorage.setItem('sem6_progress', JSON.stringify(progress));
        updateOverallProgress();
        showToast('Progress updated!', 'success');
    };

    // Notes functionality
    let currentNotesId = null;
    window.openNotes = function (topicId, topicName) {
        currentNotesId = topicId;
        document.getElementById('notes-title').textContent = `Notes: ${topicName}`;
        document.getElementById('notes-textarea').value = notes[topicId] || '';
        notesModal.classList.add('active');
    };

    document.getElementById('notes-save').addEventListener('click', () => {
        if (currentNotesId) {
            notes[currentNotesId] = document.getElementById('notes-textarea').value;
            localStorage.setItem('sem6_notes', JSON.stringify(notes));
            notesModal.classList.remove('active');
            showToast('Notes saved!', 'success');
        }
    });

    document.getElementById('notes-clear').addEventListener('click', () => {
        if (currentNotesId && confirm('Are you sure you want to clear these notes?')) {
            delete notes[currentNotesId];
            localStorage.setItem('sem6_notes', JSON.stringify(notes));
            document.getElementById('notes-textarea').value = '';
            showToast('Notes cleared!', 'info');
        }
    });

    document.getElementById('notes-close').addEventListener('click', () => {
        notesModal.classList.remove('active');
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        if (currentSearch) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        renderDashboard();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearSearch.style.display = 'none';
        renderDashboard();
    });

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderDashboard();
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Study Timer
    let timerInterval = null;
    let timerMinutes = 25;
    let timerSeconds = 0;
    let timerRunning = false;

    timerBtn.addEventListener('click', () => {
        timerModal.classList.add('active');
        // Add gradient definition for timer
        setTimeout(() => {
            const svg = document.querySelector('.timer-svg');
            if (svg && !svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', 'timer-gradient');
                gradient.setAttribute('x1', '0%');
                gradient.setAttribute('y1', '0%');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y2', '100%');
                
                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', '#6366f1');
                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', '#ec4899');
                
                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
                defs.appendChild(gradient);
                svg.appendChild(defs);
            }
        }, 100);
    });

    document.getElementById('timer-close').addEventListener('click', () => {
        timerModal.classList.remove('active');
    });

    document.getElementById('timer-start').addEventListener('click', () => {
        if (!timerRunning) {
            timerRunning = true;
            document.getElementById('timer-start').style.display = 'none';
            document.getElementById('timer-pause').style.display = 'inline-flex';
            startTimer();
        }
    });

    document.getElementById('timer-pause').addEventListener('click', () => {
        timerRunning = false;
        document.getElementById('timer-start').style.display = 'inline-flex';
        document.getElementById('timer-pause').style.display = 'none';
        clearInterval(timerInterval);
    });

    document.getElementById('timer-reset').addEventListener('click', () => {
        timerRunning = false;
        timerMinutes = 25;
        timerSeconds = 0;
        document.getElementById('timer-start').style.display = 'inline-flex';
        document.getElementById('timer-pause').style.display = 'none';
        clearInterval(timerInterval);
        updateTimerDisplay();
        updateTimerProgress(0);
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timerMinutes = parseInt(btn.dataset.minutes);
            timerSeconds = 0;
            updateTimerDisplay();
            updateTimerProgress(0);
        });
    });
    
    // Set default preset as active
    document.querySelector('.preset-btn[data-minutes="25"]')?.classList.add('active');

    function startTimer() {
        timerInterval = setInterval(() => {
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    clearInterval(timerInterval);
                    timerRunning = false;
                    const activePreset = document.querySelector('.preset-btn.active');
                    const initialMinutes = activePreset ? parseInt(activePreset.dataset.minutes) : 25;
                    studyTime += initialMinutes * 60;
                    localStorage.setItem('sem6_study_time', studyTime);
                    showToast('Study session complete! Great job! 🎉', 'success');
                    document.getElementById('timer-start').style.display = 'inline-flex';
                    document.getElementById('timer-pause').style.display = 'none';
                    updateTimerProgress(100);
                    return;
                }
                timerMinutes--;
                timerSeconds = 59;
            } else {
                timerSeconds--;
            }
            updateTimerDisplay();
            const totalSeconds = timerMinutes * 60 + timerSeconds;
            const activePreset = document.querySelector('.preset-btn.active');
            const initialMinutes = activePreset ? parseInt(activePreset.dataset.minutes) : 25;
            const initialSeconds = initialMinutes * 60;
            const elapsed = initialSeconds - totalSeconds;
            const progress = Math.max(0, Math.min(100, (elapsed / initialSeconds) * 100));
            updateTimerProgress(progress);
        }, 1000);
    }

    function updateTimerDisplay() {
        document.getElementById('timer-minutes').textContent = 
            String(timerMinutes).padStart(2, '0');
        document.getElementById('timer-seconds').textContent = 
            String(timerSeconds).padStart(2, '0');
    }

    function updateTimerProgress(percent) {
        const circle = document.querySelector('.timer-progress');
        const circumference = 2 * Math.PI * 110;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Statistics
    statsBtn.addEventListener('click', () => {
        updateStatistics();
        statsModal.classList.add('active');
    });

    document.getElementById('stats-close').addEventListener('click', () => {
        statsModal.classList.remove('active');
    });

    function updateStatistics() {
        let totalCompleted = 0;
        let totalTopics = 0;

        semesterData.forEach(subject => {
            const completed = countCompletedTopics(subject);
            const total = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            totalCompleted += completed;
            totalTopics += total;
        });

        document.getElementById('stat-completed').textContent = totalCompleted;
        document.getElementById('stat-total').textContent = totalTopics;
        document.getElementById('stat-streak').textContent = studyStreak;
        document.getElementById('stat-time').textContent = formatStudyTime(studyTime);

        // Subject progress list
        const progressList = document.getElementById('subject-progress-list');
        progressList.innerHTML = '';
        semesterData.forEach(subject => {
            const completed = countCompletedTopics(subject);
            const total = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

            const item = document.createElement('div');
            item.className = 'subject-progress-item';
            item.innerHTML = `
                <div class="subject-progress-name">${subject.code}</div>
                <div class="subject-progress-bar-container">
                    <div class="subject-progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="subject-progress-percent">${percentage}%</div>
            `;
            progressList.appendChild(item);
        });
    }

    function formatStudyTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Overall progress
    function updateOverallProgress() {
        let totalCompleted = 0;
        let totalTopics = 0;

        semesterData.forEach(subject => {
            const completed = countCompletedTopics(subject);
            const total = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            totalCompleted += completed;
            totalTopics += total;
        });

        const percentage = totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100);
        document.getElementById('overall-progress').textContent = `${percentage}%`;
        document.getElementById('study-streak').textContent = studyStreak;
    }

    // Study streak
    function checkStudyStreak() {
        const today = new Date().toDateString();
        if (lastStudyDate) {
            const lastDate = new Date(lastStudyDate);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Same day, keep streak
            } else if (diffDays === 1) {
                // Consecutive day, increment streak
                studyStreak++;
                localStorage.setItem('sem6_streak', studyStreak);
            } else {
                // Streak broken
                studyStreak = 1;
                localStorage.setItem('sem6_streak', studyStreak);
            }
        } else {
            studyStreak = 1;
            localStorage.setItem('sem6_streak', studyStreak);
        }
        updateOverallProgress();
    }

    function updateStudyDate() {
        const today = new Date().toDateString();
        if (lastStudyDate !== today) {
            lastStudyDate = today;
            localStorage.setItem('sem6_last_study_date', lastStudyDate);
            checkStudyStreak();
        }
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Close modals on outside click
    [timerModal, notesModal, statsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Back Button Handler
    backBtn.addEventListener('click', () => {
        detailView.classList.remove('active');
        dashboardView.style.display = 'block';
        renderDashboard();
    });


    // Initial Render
    renderDashboard();
    updateTimerDisplay();
    updateTimerProgress(0);
});
