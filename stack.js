class Stack {
  constructor(maxSize = 10) {
      this.items = [];
      this.maxSize = maxSize;
      this.subscribers = new Set();
  }

  push(value) {
      // Type and value validation
      if (typeof value !== 'number' || isNaN(value)) {
          throw new Error('Invalid input: Please enter a valid number');
      }

      // Check size limit
      if (this.items.length >= this.maxSize) {
          throw new Error(`Stack overflow: Cannot exceed maximum size of ${this.maxSize}`);
      }

      this.items.push(value);
      this.notifySubscribers();
      return true;
  }

  pop() {
      if (this.isEmpty()) {
          throw new Error('Stack underflow: Cannot pop from empty stack');
      }

      const item = this.items.pop();
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
      return this.items[this.items.length - 1];
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

// UI Controller - Separates DOM handling from Stack logic
class StackViewController {
  constructor(stackInstance) {
      this.stack = stackInstance;
      this.visualization = document.getElementById('stackVisual');
      this.input = document.getElementById('inputValue');
      this.pushButton = document.getElementById('pushButton');
      this.popButton = document.getElementById('popButton');

      // Validate required DOM elements
      if (!this.visualization || !this.input || !this.pushButton || !this.popButton) {
          throw new Error('Required DOM elements not found');
      }

      this.initializeEventListeners();
      this.stack.subscribe(this.render.bind(this));
  }

  initializeEventListeners() {
      this.pushButton.addEventListener('click', this.handlePush.bind(this));
      this.popButton.addEventListener('click', this.handlePop.bind(this));
      
      // Add keyboard support
      this.input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              this.handlePush();
          }
      });
  }

  handlePush() {
      try {
          const value = parseInt(this.input.value);
          this.stack.push(value);
          this.input.value = '';
          this.showMessage('success', `Successfully pushed ${value}`);
      } catch (error) {
          this.showMessage('error', error.message);
      }
  }

  handlePop() {
      try {
          const value = this.stack.pop();
          this.showMessage('success', `Successfully popped ${value}`);
      } catch (error) {
          this.showMessage('error', error.message);
      }
  }

  render(items) {
      this.visualization.innerHTML = '';
      
      items.forEach((item, index) => {
          const element = document.createElement('div');
          element.className = 'stack-item';
          element.textContent = item;

          if (index === items.length - 1) {
              element.classList.add('top');
              element.classList.add('pushing');
          }

          this.visualization.appendChild(element);
      });
  }

  showMessage(type, message) {
      // Create or update message element
      let messageEl = document.getElementById('stackMessage');
      if (!messageEl) {
          messageEl = document.createElement('div');
          messageEl.id = 'stackMessage';
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
  const stack = new Stack(10); // Set maximum size to 10
  const controller = new StackViewController(stack);

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
  console.error('Failed to initialize stack application:', error);
  // Show error in UI if possible
  const root = document.getElementById('stackVisual')?.parentNode;
  if (root) {
      root.innerHTML = `<div class="error">Failed to initialize stack application: ${error.message}</div>`;
  }
}
