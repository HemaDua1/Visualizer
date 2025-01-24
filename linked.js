class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    insertAtHead(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.length++;
        this.updateInfoPanel();
    }

    insertAtTail(value) {
        const newNode = new Node(value);
        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
        this.updateInfoPanel();
    }

    insertAt(value, position) {
        if (position < 0 || position > this.length) {
            alert('Invalid position!');
            return;
        }

        if (position === 0) {
            this.insertAtHead(value);
            return;
        }

        if (position === this.length) {
            this.insertAtTail(value);
            return;
        }

        const newNode = new Node(value);
        let current = this.head;
        let prev = null;
        let index = 0;

        while (index < position) {
            prev = current;
            current = current.next;
            index++;
        }

        newNode.next = current;
        prev.next = newNode;
        this.length++;
        this.updateInfoPanel();
    }

    deleteNode(value) {
        if (!this.head) {
            alert('List is empty!');
            return;
        }
        if (this.head.value === value) {
            this.head = this.head.next;
            if (!this.head) this.tail = null;
            this.length--;
            this.updateInfoPanel();
            return;
        }
        let current = this.head;
        let prev = null;
    
        while (current && current.value !== value) {
            prev = current;
            current = current.next;
        }
        if (!current) {
            alert('Value not found!');
            return;
        }
        prev.next = current.next;
        if (!current.next) {
            this.tail = prev;
        }
        this.length--;
        this.updateInfoPanel();
    }
    

    updateInfoPanel() {
        document.getElementById('listLength').textContent = this.length;
        document.getElementById('headValue').textContent = this.head ? this.head.value : 'null';
        document.getElementById('tailValue').textContent = this.tail ? this.tail.value : 'null';
        this.renderVisualization();
    }

    renderVisualization() {
        const container = document.getElementById('linkedlist-container');
        container.innerHTML = '';
        container.style.display = 'flex'; // Display nodes in a row
        container.style.alignItems = 'center'; // Center align nodes vertically

        let current = this.head;
        while (current) {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'node';
            nodeDiv.textContent = current.value;

            const arrowDiv = document.createElement('div');
            arrowDiv.className = 'arrow';
            arrowDiv.textContent = '→';

            container.appendChild(nodeDiv);
            if (current.next) container.appendChild(arrowDiv);
            current = current.next;
        }
    }
}

// Initialize Linked List
const linkedList = new LinkedList();

// Event Listeners
const operationButtons = document.querySelectorAll('.operation-btn');
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const operation = button.dataset.operation;
        const value = parseInt(document.getElementById('nodeValue').value, 10);
        const position = parseInt(document.getElementById('nodePosition').value, 10);

        if (isNaN(value) && operation !== 'delete') {
            alert('Please enter a valid value!');
            return;
        }

        switch (operation) {
            case 'insertHead':
                linkedList.insertAtHead(value);
                break;
            case 'insertTail':
                linkedList.insertAtTail(value);
                break;
            case 'insertAt':
                if (isNaN(position)) {
                    alert('Please enter a valid position!');
                    return;
                }
                linkedList.insertAt(value, position);
                break;
            case 'delete':
                linkedList.deleteNode(value);
                break;
            default:
                alert('Invalid operation!');
        }

        document.getElementById('nodeValue').value = '';
        document.getElementById('nodePosition').value = '';
    });
});