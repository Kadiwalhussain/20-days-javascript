// Task Planner Application
class TaskPlanner {
    constructor() {
        this.tasks = [];
        this.dailyGoal = 5;
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadFromStorage();
        this.updateUI();
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('taskForm');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskDescription = document.getElementById('taskDescription');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskTime = document.getElementById('taskTime');
        
        // Filter and search elements
        this.filterTasks = document.getElementById('filterTasks');
        this.searchTasks = document.getElementById('searchTasks');
        
        // Display elements
        this.tasksContainer = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        
        // Modal elements
        this.goalModal = document.getElementById('goalModal');
        this.dailyGoalInput = document.getElementById('dailyGoal');
        this.setGoalBtn = document.getElementById('setGoalBtn');
    }

    attachEventListeners() {
        // Form submission
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        
        // Filter and search
        this.filterTasks.addEventListener('change', (e) => this.handleFilterChange(e));
        this.searchTasks.addEventListener('input', (e) => this.handleSearch(e));
        
        // Modal events
        this.setGoalBtn.addEventListener('click', () => this.setDailyGoal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.goalModal) this.closeModal();
        });
        
        // Auto-set current time as default
        this.setDefaultTime();
        
        // Show goal modal on first visit
        if (!localStorage.getItem('dailyGoal')) {
            setTimeout(() => this.showGoalModal(), 1000);
        }
    }

    setDefaultTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.taskTime.value = `${hours}:${minutes}`;
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const title = this.taskTitle.value.trim();
        const description = this.taskDescription.value.trim();
        const priority = this.taskPriority.value;
        const dueTime = this.taskTime.value;
        
        if (!title || !priority || !dueTime) {
            alert('Please fill in all required fields!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            title,
            description,
            priority,
            dueTime,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.unshift(newTask);
        this.saveToStorage();
        this.updateUI();
        this.resetForm();
        
        // Show success animation
        this.showNotification('Task added successfully!', 'success');
    }

    handleFilterChange(e) {
        this.currentFilter = e.target.value;
        this.updateTasksDisplay();
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.updateTasksDisplay();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveToStorage();
            this.updateUI();
            
            const message = task.completed ? 'Task completed! Great job!' : 'Task marked as pending';
            const type = task.completed ? 'success' : 'info';
            this.showNotification(message, type);
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToStorage();
            this.updateUI();
            this.showNotification('Task deleted', 'error');
        }
    }

    getFilteredTasks() {
        let filtered = this.tasks;
        
        // Apply priority/status filter
        switch (this.currentFilter) {
            case 'high':
            case 'medium':
            case 'low':
                filtered = filtered.filter(task => task.priority === this.currentFilter);
                break;
            case 'completed':
                filtered = filtered.filter(task => task.completed);
                break;
            case 'pending':
                filtered = filtered.filter(task => !task.completed);
                break;
        }
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(this.searchTerm) ||
                task.description.toLowerCase().includes(this.searchTerm)
            );
        }
        
        return filtered;
    }

    updateTasksDisplay() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.tasksContainer.style.display = 'none';
            this.emptyState.style.display = 'block';
            
            if (this.searchTerm || this.currentFilter !== 'all') {
                this.emptyState.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No tasks found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                `;
            } else {
                this.emptyState.innerHTML = `
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No tasks yet!</h3>
                    <p>Add your first task to get started on your productivity journey.</p>
                `;
            }
        } else {
            this.tasksContainer.style.display = 'grid';
            this.emptyState.style.display = 'none';
            
            this.tasksContainer.innerHTML = filteredTasks.map(task => 
                this.createTaskHTML(task)
            ).join('');
            
            // Attach event listeners to new task cards
            this.attachTaskEventListeners();
        }
    }

    createTaskHTML(task) {
        const priorityIcons = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };
        
        const timeRemaining = this.getTimeRemaining(task.dueTime);
        const isOverdue = timeRemaining.includes('overdue');
        
        return `
            <div class="task-card ${task.priority} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <div class="priority-badge ${task.priority}">
                            ${priorityIcons[task.priority]} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </div>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                
                <div class="task-time ${isOverdue ? 'overdue' : ''}">
                    <i class="fas fa-clock"></i>
                    <span>Due: ${task.dueTime} ${timeRemaining}</span>
                </div>
                
                <div class="task-actions">
                    <button class="btn ${task.completed ? 'btn-undo' : 'btn-complete'}" onclick="taskPlanner.toggleTaskComplete(${task.id})">
                        <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-delete" onclick="taskPlanner.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        // Event listeners are handled through onclick attributes in the HTML
        // This approach is used for simplicity and to avoid event delegation complexity
    }

    getTimeRemaining(dueTime) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const [hours, minutes] = dueTime.split(':').map(Number);
        const dueDate = new Date(today.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
        
        const diffMs = dueDate - now;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 0) {
            const overdueMins = Math.abs(diffMins);
            if (overdueMins < 60) {
                return `(${overdueMins} mins overdue)`;
            } else {
                const overdueHours = Math.floor(overdueMins / 60);
                return `(${overdueHours}h ${overdueMins % 60}m overdue)`;
            }
        } else if (diffMins < 60) {
            return `(${diffMins} mins remaining)`;
        } else {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            return `(${hours}h ${mins}m remaining)`;
        }
    }

    updateProgressStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
        
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressText.textContent = `${progressPercentage}% Complete`;
        
        // Update progress bar color based on goal achievement
        if (completed >= this.dailyGoal) {
            this.progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        } else {
            this.progressBar.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
        }
    }

    updateUI() {
        this.updateTasksDisplay();
        this.updateProgressStats();
    }

    resetForm() {
        this.taskForm.reset();
        this.setDefaultTime();
    }

    showGoalModal() {
        this.dailyGoalInput.value = this.dailyGoal;
        this.goalModal.style.display = 'block';
    }

    closeModal() {
        this.goalModal.style.display = 'none';
    }

    setDailyGoal() {
        const goal = parseInt(this.dailyGoalInput.value);
        if (goal >= 1 && goal <= 50) {
            this.dailyGoal = goal;
            localStorage.setItem('dailyGoal', goal);
            this.closeModal();
            this.updateProgressStats();
            this.showNotification(`Daily goal set to ${goal} tasks!`, 'success');
        } else {
            alert('Please enter a goal between 1 and 50 tasks.');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveToStorage() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            localStorage.setItem('dailyGoal', this.dailyGoal);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            this.showNotification('Failed to save data', 'error');
        }
    }

    loadFromStorage() {
        try {
            const savedTasks = localStorage.getItem('tasks');
            const savedGoal = localStorage.getItem('dailyGoal');
            
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
            
            if (savedGoal) {
                this.dailyGoal = parseInt(savedGoal);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            this.showNotification('Failed to load saved data', 'error');
        }
    }

    // Utility method to export tasks as JSON
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Tasks exported successfully!', 'success');
    }

    // Utility method to get task statistics
    getTaskStatistics() {
        const stats = {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
            high: this.tasks.filter(t => t.priority === 'high').length,
            medium: this.tasks.filter(t => t.priority === 'medium').length,
            low: this.tasks.filter(t => t.priority === 'low').length,
            completionRate: this.tasks.length > 0 ? ((this.tasks.filter(t => t.completed).length / this.tasks.length) * 100).toFixed(1) : 0
        };
        
        return stats;
    }

    // Method to clear all completed tasks
    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveToStorage();
            this.updateUI();
            this.showNotification(`${completedCount} completed task(s) cleared`, 'success');
        }
    }

    // Method to sort tasks
    sortTasks(criteria) {
        switch (criteria) {
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                this.tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'time':
                this.tasks.sort((a, b) => a.dueTime.localeCompare(b.dueTime));
                break;
            case 'created':
                this.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'title':
                this.tasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        
        this.saveToStorage();
        this.updateUI();
        this.showNotification(`Tasks sorted by ${criteria}`, 'info');
    }

    // Method to get overdue tasks
    getOverdueTasks() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return this.tasks.filter(task => {
            if (task.completed) return false;
            
            const [hours, minutes] = task.dueTime.split(':').map(Number);
            const dueDate = new Date(today.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
            
            return dueDate < now;
        });
    }

    // Method to initialize keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+N or Cmd+N to focus on new task input
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.taskTitle.focus();
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                this.searchTasks.value = '';
                this.searchTerm = '';
                this.updateTasksDisplay();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskPlanner = new TaskPlanner();
    
    // Add some additional functionality for development/testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Task Planner loaded successfully!');
        console.log('Available methods:', Object.getOwnPropertyNames(TaskPlanner.prototype));
        
        // Add some sample tasks for testing (only in development)
        // window.taskPlanner.addSampleTasks();
    }
});

// Add sample tasks method for testing
TaskPlanner.prototype.addSampleTasks = function() {
    const sampleTasks = [
        {
            id: Date.now() + 1,
            title: 'Complete project proposal',
            description: 'Finish the quarterly project proposal for the marketing team',
            priority: 'high',
            dueTime: '14:00',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            title: 'Review team feedback',
            description: 'Go through all feedback from the team meeting',
            priority: 'medium',
            dueTime: '16:30',
            completed: true,
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            title: 'Update documentation',
            description: 'Update the API documentation with new endpoints',
            priority: 'low',
            dueTime: '10:00',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    this.tasks = [...sampleTasks, ...this.tasks];
    this.saveToStorage();
    this.updateUI();
    this.showNotification('Sample tasks added for testing', 'info');
};

// Add global utility functions for console access
window.taskUtils = {
    exportTasks: () => window.taskPlanner.exportTasks(),
    getStats: () => window.taskPlanner.getTaskStatistics(),
    clearCompleted: () => window.taskPlanner.clearCompletedTasks(),
    sortBy: (criteria) => window.taskPlanner.sortTasks(criteria),
    getOverdue: () => window.taskPlanner.getOverdueTasks()
};