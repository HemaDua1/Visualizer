class Queue {
    constructor(maxSize = 10) {
        this.items = [];
        this.maxSize = maxSize;
        this.subscribers = new Set();
    }

    enqueue(value) {
        // Type and value validation
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Invalid input: Please enter a valid number');
        }

        // Check size limit
        if (this.items.length >= this.maxSize) {
            throw new Error(`Queue overflow: Cannot exceed maximum size of ${this.maxSize}`);
        }

        this.items.push(value);
        this.notifySubscribers();
        return true;
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue underflow: Cannot dequeue from empty queue');
        }

        const item = this.items.shift();
        this.notifySubscribers();
        return item;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    size() {
        return this.items.length;
    }

    // Observer pattern for UI updates
    subscribe(callback) {
        this.subscribers.add(callback);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.items));
    }
}

// UI Controller - Separates DOM handling from Queue logic
class QueueViewController {
    constructor(queueInstance) {
        this.queue = queueInstance;
        this.visualization = document.getElementById('queueVisual');
        this.input = document.getElementById('inputValue');
        this.enqueueButton = document.getElementById('enqueueButton');
        this.dequeueButton = document.getElementById('dequeueButton');

        // Validate required DOM elements
        if (!this.visualization || !this.input || !this.enqueueButton || !this.dequeueButton) {
            throw new Error('Required DOM elements not found');
        }

        this.initializeEventListeners();
        this.queue.subscribe(this.render.bind(this));
    }

    initializeEventListeners() {
        this.enqueueButton.addEventListener('click', this.handleEnqueue.bind(this));
        this.dequeueButton.addEventListener('click', this.handleDequeue.bind(this));
        
        // Add keyboard support
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleEnqueue();
            }
        });
    }

    handleEnqueue() {
        try {
            const value = parseInt(this.input.value);
            this.queue.enqueue(value);
            this.input.value = '';
            this.showMessage('success', `Successfully enqueued ${value}`);
        } catch (error) {
            this.showMessage('error', error.message);
        }
    }

    handleDequeue() {
        try {
            const value = this.queue.dequeue();
            this.showMessage('success', `Successfully dequeued ${value}`);
        } catch (error) {
            this.showMessage('error', error.message);
        }
    }

    render(items) {
        this.visualization.innerHTML = '';
        
        items.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'queue-item';
            element.textContent = item;

            if (index === items.length - 1) {
                element.classList.add('last');
                element.classList.add('entering');
            }
            if (index === 0) {
                element.classList.add('first');
            }

            this.visualization.appendChild(element);
        });
    }

    showMessage(type, message) {
        // Create or update message element
        let messageEl = document.getElementById('queueMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'queueMessage';
            this.visualization.parentNode.insertBefore(messageEl, this.visualization.nextSibling);
        }

        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        // Auto-hide message after 3 seconds
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = '';
        }, 3000);
    }
}

// Initialize the application
try {
    const queue = new Queue(10); // Set maximum size to 10
    const controller = new QueueViewController(queue);

    // Initialize tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
} catch (error) {
    console.error('Failed to initialize queue application:', error);
    // Show error in UI if possible
    const root = document.getElementById('queueVisual')?.parentNode;
    if (root) {
        root.innerHTML = `<div class="error">Failed to initialize queue application: ${error.message}</div>`;
    }
}