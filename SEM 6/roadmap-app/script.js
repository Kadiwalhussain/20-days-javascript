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
    const analyticsBtn = document.getElementById('analytics-btn');
    const timerModal = document.getElementById('timer-modal');
    const notesModal = document.getElementById('notes-modal');
    const statsModal = document.getElementById('stats-modal');
    const analyticsModal = document.getElementById('analytics-modal');
    const topicTimerModal = document.getElementById('topic-timer-modal');
    const topicStatsModal = document.getElementById('topic-stats-modal');

    // Load data from local storage
    let progress = JSON.parse(localStorage.getItem('sem6_progress')) || {};
    let notes = JSON.parse(localStorage.getItem('sem6_notes')) || {};
    let studyTime = parseInt(localStorage.getItem('sem6_study_time')) || 0;
    let studyStreak = parseInt(localStorage.getItem('sem6_streak')) || 0;
    let lastStudyDate = localStorage.getItem('sem6_last_study_date') || null;
    let topicTimeData = JSON.parse(localStorage.getItem('sem6_topic_time')) || {};
    let topicSessions = JSON.parse(localStorage.getItem('sem6_topic_sessions')) || {};
    let dailyStudyTime = JSON.parse(localStorage.getItem('sem6_daily_time')) || {};
    let progressHistory = JSON.parse(localStorage.getItem('sem6_progress_history')) || [];
    let currentFilter = 'all';
    let currentSearch = '';
    let charts = {};

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
                const topicTime = topicTimeData[topicId] || 0;
                const formattedTime = formatTime(topicTime);

                return `
                    <div class="topic-item" data-topic-id="${topicId}">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="${topicId}" class="topic-checkbox" ${isChecked} 
                                onchange="toggleTopic('${topicId}')">
                            <label for="${topicId}" class="custom-checkbox"></label>
                        </div>
                        <label for="${topicId}" class="topic-text">${topic}</label>
                        <div class="topic-actions">
                            <button class="topic-action-btn" onclick="openTopicTimer('${topicId}', '${topic.replace(/'/g, "\\'")}')" title="Start Timer">
                                <i class="fas fa-clock"></i>
                            </button>
                            <button class="topic-action-btn" onclick="openNotes('${topicId}', '${topic.replace(/'/g, "\\'")}')" title="Add Notes">
                                <i class="fas fa-sticky-note"></i>
                            </button>
                            <button class="topic-action-btn" onclick="showTopicStats('${topicId}', '${topic.replace(/'/g, "\\'")}')" title="View Stats">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                        </div>
                        <div class="topic-time-display" id="time-${topicId}">
                            <i class="fas fa-hourglass-half"></i>
                            <span class="topic-time-text">${formattedTime}</span>
                        </div>
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

    // Helper function to format time
    function formatTime(seconds) {
        if (!seconds) return '0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Topic Timer Functionality
    let currentTopicTimerId = null;
    let topicTimerInterval = null;
    let topicTimerMinutes = 25;
    let topicTimerSeconds = 0;
    let topicTimerRunning = false;
    let topicTimerStartTime = null;

    window.openTopicTimer = function(topicId, topicName) {
        currentTopicTimerId = topicId;
        document.getElementById('topic-timer-title').textContent = `Timer: ${topicName}`;
        document.getElementById('topic-timer-topic-name').textContent = topicName;
        const totalTime = topicTimeData[topicId] || 0;
        document.getElementById('topic-timer-total').textContent = formatTime(totalTime);
        topicTimerMinutes = 25;
        topicTimerSeconds = 0;
        updateTopicTimerDisplay();
        updateTopicTimerProgress(0);
        
        // Set default preset as active
        document.querySelectorAll('.topic-preset-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.topic-preset-btn[data-minutes="25"]')?.classList.add('active');
        
        // Add gradient definition for topic timer
        setTimeout(() => {
            const svg = document.querySelector('.topic-timer-svg');
            if (svg && !svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', 'topic-timer-gradient');
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
        
        topicTimerModal.classList.add('active');
    };

    document.getElementById('topic-timer-close').addEventListener('click', () => {
        if (topicTimerRunning) {
            saveTopicTimerTime();
        }
        topicTimerModal.classList.remove('active');
    });

    document.getElementById('topic-timer-start').addEventListener('click', () => {
        if (!topicTimerRunning) {
            topicTimerRunning = true;
            topicTimerStartTime = Date.now();
            document.getElementById('topic-timer-start').style.display = 'none';
            document.getElementById('topic-timer-pause').style.display = 'inline-flex';
            startTopicTimer();
        }
    });

    document.getElementById('topic-timer-pause').addEventListener('click', () => {
        topicTimerRunning = false;
        saveTopicTimerTime();
        document.getElementById('topic-timer-start').style.display = 'inline-flex';
        document.getElementById('topic-timer-pause').style.display = 'none';
        clearInterval(topicTimerInterval);
    });

    document.getElementById('topic-timer-reset').addEventListener('click', () => {
        topicTimerRunning = false;
        topicTimerMinutes = 25;
        topicTimerSeconds = 0;
        document.getElementById('topic-timer-start').style.display = 'inline-flex';
        document.getElementById('topic-timer-pause').style.display = 'none';
        clearInterval(topicTimerInterval);
        updateTopicTimerDisplay();
        updateTopicTimerProgress(0);
    });

    document.querySelectorAll('.topic-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.topic-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            topicTimerMinutes = parseInt(btn.dataset.minutes);
            topicTimerSeconds = 0;
            updateTopicTimerDisplay();
            updateTopicTimerProgress(0);
        });
    });

    function startTopicTimer() {
        topicTimerInterval = setInterval(() => {
            if (topicTimerSeconds === 0) {
                if (topicTimerMinutes === 0) {
                    clearInterval(topicTimerInterval);
                    topicTimerRunning = false;
                    saveTopicTimerTime();
                    showToast('Topic study session complete! 🎉', 'success');
                    document.getElementById('topic-timer-start').style.display = 'inline-flex';
                    document.getElementById('topic-timer-pause').style.display = 'none';
                    updateTopicTimerProgress(100);
                    return;
                }
                topicTimerMinutes--;
                topicTimerSeconds = 59;
            } else {
                topicTimerSeconds--;
            }
            updateTopicTimerDisplay();
            const activePreset = document.querySelector('.topic-preset-btn.active');
            const initialMinutes = activePreset ? parseInt(activePreset.dataset.minutes) : 25;
            const totalSeconds = topicTimerMinutes * 60 + topicTimerSeconds;
            const initialSeconds = initialMinutes * 60;
            const elapsed = initialSeconds - totalSeconds;
            const progress = Math.max(0, Math.min(100, (elapsed / initialSeconds) * 100));
            updateTopicTimerProgress(progress);
        }, 1000);
    }

    function saveTopicTimerTime() {
        if (currentTopicTimerId && topicTimerStartTime) {
            const elapsed = Math.floor((Date.now() - topicTimerStartTime) / 1000);
            if (elapsed > 0) {
                topicTimeData[currentTopicTimerId] = (topicTimeData[currentTopicTimerId] || 0) + elapsed;
                if (!topicSessions[currentTopicTimerId]) {
                    topicSessions[currentTopicTimerId] = [];
                }
                topicSessions[currentTopicTimerId].push({
                    date: new Date().toISOString(),
                    duration: elapsed
                });
                localStorage.setItem('sem6_topic_time', JSON.stringify(topicTimeData));
                localStorage.setItem('sem6_topic_sessions', JSON.stringify(topicSessions));
                
                // Update daily study time
                const today = new Date().toDateString();
                dailyStudyTime[today] = (dailyStudyTime[today] || 0) + elapsed;
                localStorage.setItem('sem6_daily_time', JSON.stringify(dailyStudyTime));
                
                // Update display
                const timeDisplay = document.getElementById(`time-${currentTopicTimerId}`);
                if (timeDisplay) {
                    timeDisplay.querySelector('.topic-time-text').textContent = formatTime(topicTimeData[currentTopicTimerId]);
                }
                document.getElementById('topic-timer-total').textContent = formatTime(topicTimeData[currentTopicTimerId]);
                topicTimerStartTime = null;
            }
        }
    }

    function updateTopicTimerDisplay() {
        document.getElementById('topic-timer-minutes').textContent = 
            String(topicTimerMinutes).padStart(2, '0');
        document.getElementById('topic-timer-seconds').textContent = 
            String(topicTimerSeconds).padStart(2, '0');
    }

    function updateTopicTimerProgress(percent) {
        const circle = document.querySelector('.topic-timer-progress');
        if (circle) {
            const circumference = 2 * Math.PI * 90;
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    }

    // Topic Stats
    window.showTopicStats = function(topicId, topicName) {
        document.getElementById('topic-stats-title').textContent = `Stats: ${topicName}`;
        const totalTime = topicTimeData[topicId] || 0;
        const sessions = topicSessions[topicId] || [];
        const avgSession = sessions.length > 0 ? Math.floor(totalTime / sessions.length) : 0;
        const status = progress[topicId] ? 'Completed' : (totalTime > 0 ? 'In Progress' : 'Not Started');

        document.getElementById('topic-total-time').textContent = formatTime(totalTime);
        document.getElementById('topic-sessions').textContent = sessions.length;
        document.getElementById('topic-avg-session').textContent = formatTime(avgSession);
        document.getElementById('topic-status').textContent = status;

        // Create chart for topic time over time
        setTimeout(() => {
            createTopicTimeChart(topicId, sessions);
        }, 100);

        topicStatsModal.classList.add('active');
    };

    function createTopicTimeChart(topicId, sessions) {
        const ctx = document.getElementById('topic-time-chart');
        if (!ctx) return;

        if (charts.topicTime) {
            charts.topicTime.destroy();
        }

        const dates = sessions.map(s => new Date(s.date).toLocaleDateString());
        const durations = sessions.map(s => Math.floor(s.duration / 60)); // Convert to minutes

        charts.topicTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.length > 0 ? dates : ['No data'],
                datasets: [{
                    label: 'Study Time (minutes)',
                    data: durations.length > 0 ? durations : [0],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    document.getElementById('topic-stats-close').addEventListener('click', () => {
        topicStatsModal.classList.remove('active');
    });

    // Advanced Analytics
    analyticsBtn.addEventListener('click', () => {
        analyticsModal.classList.add('active');
        setTimeout(() => {
            initializeAnalyticsCharts();
        }, 100);
    });

    document.getElementById('analytics-close').addEventListener('click', () => {
        analyticsModal.classList.remove('active');
    });

    // Analytics tabs
    document.querySelectorAll('.analytics-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.analytics-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            setTimeout(() => {
                initializeAnalyticsCharts();
            }, 100);
        });
    });

    function initializeAnalyticsCharts() {
        createProgressPieChart();
        createSubjectBarChart();
        createSubjectTimeChart();
        createTopicsCompletedChart();
        createDailyTimeChart();
        createTimeDistributionChart();
        createProgressLineChart();
    }

    function createProgressPieChart() {
        const ctx = document.getElementById('progress-pie-chart');
        if (!ctx) return;

        let totalCompleted = 0;
        let totalTopics = 0;
        semesterData.forEach(subject => {
            totalCompleted += countCompletedTopics(subject);
            totalTopics += subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
        });
        const remaining = totalTopics - totalCompleted;

        if (charts.progressPie) charts.progressPie.destroy();
        charts.progressPie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [totalCompleted, remaining],
                    backgroundColor: ['#10b981', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    function createSubjectBarChart() {
        const ctx = document.getElementById('subject-bar-chart');
        if (!ctx) return;

        const labels = semesterData.map(s => s.code);
        const data = semesterData.map(subject => {
            const total = subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            const completed = countCompletedTopics(subject);
            return total === 0 ? 0 : Math.round((completed / total) * 100);
        });

        if (charts.subjectBar) charts.subjectBar.destroy();
        charts.subjectBar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completion %',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function createSubjectTimeChart() {
        const ctx = document.getElementById('subject-time-chart');
        if (!ctx) return;

        const labels = semesterData.map(s => s.code);
        const data = semesterData.map(subject => {
            let totalTime = 0;
            subject.modules.forEach(module => {
                module.topics.forEach((topic, index) => {
                    const topicId = `${module.id}-t${index}`;
                    totalTime += topicTimeData[topicId] || 0;
                });
            });
            return Math.floor(totalTime / 60); // Convert to minutes
        });

        if (charts.subjectTime) charts.subjectTime.destroy();
        charts.subjectTime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Time (minutes)',
                    data: data,
                    backgroundColor: 'rgba(236, 72, 153, 0.8)',
                    borderColor: 'rgb(236, 72, 153)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    function createTopicsCompletedChart() {
        const ctx = document.getElementById('topics-completed-chart');
        if (!ctx) return;

        const labels = semesterData.map(s => s.code);
        const completed = semesterData.map(s => countCompletedTopics(s));
        const total = semesterData.map(s => s.modules.reduce((acc, m) => acc + m.topics.length, 0));

        if (charts.topicsCompleted) charts.topicsCompleted.destroy();
        charts.topicsCompleted = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Completed',
                        data: completed,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)'
                    },
                    {
                        label: 'Total',
                        data: total,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    function createDailyTimeChart() {
        const ctx = document.getElementById('daily-time-chart');
        if (!ctx) return;

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toDateString());
        }

        const data = last7Days.map(day => Math.floor((dailyStudyTime[day] || 0) / 60));

        if (charts.dailyTime) charts.dailyTime.destroy();
        charts.dailyTime = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Study Time (minutes)',
                    data: data,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    function createTimeDistributionChart() {
        const ctx = document.getElementById('time-distribution-chart');
        if (!ctx) return;

        const subjectTimes = semesterData.map(subject => {
            let totalTime = 0;
            subject.modules.forEach(module => {
                module.topics.forEach((topic, index) => {
                    const topicId = `${module.id}-t${index}`;
                    totalTime += topicTimeData[topicId] || 0;
                });
            });
            return Math.floor(totalTime / 60);
        });

        const labels = semesterData.map(s => s.code);
        const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)'
        ];

        if (charts.timeDistribution) charts.timeDistribution.destroy();
        charts.timeDistribution = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: subjectTimes,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    function createProgressLineChart() {
        const ctx = document.getElementById('progress-line-chart');
        if (!ctx) return;

        // Generate last 7 days
        const dates = [];
        const progressData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString());
            // For now, use current progress (in real app, would track historical)
            let totalCompleted = 0;
            let totalTopics = 0;
            semesterData.forEach(subject => {
                totalCompleted += countCompletedTopics(subject);
                totalTopics += subject.modules.reduce((acc, module) => acc + module.topics.length, 0);
            });
            progressData.push(totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100));
        }

        if (charts.progressLine) charts.progressLine.destroy();
        charts.progressLine = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Progress %',
                    data: progressData,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }

    // Close modals on outside click
    [timerModal, notesModal, statsModal, analyticsModal, topicTimerModal, topicStatsModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // Back Button Handler
    backBtn.addEventListener('click', () => {
        detailView.classList.remove('active');
        dashboardView.style.display = 'block';
        renderDashboard();
    });


    // Update topic time displays when rendering
    function updateTopicTimeDisplays() {
        Object.keys(topicTimeData).forEach(topicId => {
            const timeDisplay = document.getElementById(`time-${topicId}`);
            if (timeDisplay) {
                timeDisplay.querySelector('.topic-time-text').textContent = formatTime(topicTimeData[topicId]);
            }
        });
    }

    // Initial Render
    renderDashboard();
    updateTimerDisplay();
    updateTimerProgress(0);
    updateTopicTimeDisplays();
});
