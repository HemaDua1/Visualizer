class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.level = 0;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
        this.isBST = false;
        this.subscribers = new Set();
        this.nodeSpacing = 80;
        this.levelHeight = 100;
    }

    insert(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Invalid input: Please enter a valid number');
        }

        if (this.isBST) {
            this.root = this._insertBST(this.root, value, 0);
        } else {
            this.root = this._insertBT(this.root, value, 0);
        }
        
        this._updatePositions();
        this.notifySubscribers();
    }

    _insertBST(node, value, level) {
        if (!node) {
            return new TreeNode(value);
        }

        if (value < node.value) {
            node.left = this._insertBST(node.left, value, level + 1);
        } else if (value > node.value) {
            node.right = this._insertBST(node.right, value, level + 1);
        }

        node.level = level;
        return node;
    }

    _insertBT(node, value, level) {
        // For empty tree
        if (!node) {
            return new TreeNode(value);
        }
        const queue = [node];
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current.left) {
                current.left = new TreeNode(value);
                current.left.level = current.level + 1;
                return this.root; 
            }
            else if (!current.right) {
                current.right = new TreeNode(value);
                current.right.level = current.level + 1;
                return this.root; }
            else {
                queue.push(current.left);
                queue.push(current.right);
            }
        }
        return this.root;
    }

    delete(value) {
        if (!this.root) {
            throw new Error('Tree is empty');
        }

        if (this.isBST) {
            this.root = this._deleteBST(this.root, value);
        } else {
            this.root = this._deleteBT(this.root, value);
        }

        this._updatePositions();
        this.notifySubscribers();
    }

    _deleteBST(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._deleteBST(node.left, value);
        } else if (value > node.value) {
            node.right = this._deleteBST(node.right, value);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            let minNode = this._findMin(node.right);
            node.value = minNode.value;
            node.right = this._deleteBST(node.right, minNode.value);
        }
        return node;
    }

    _deleteBT(node, value) {
        if (!node) return null;

        // Find the node to delete using level-order traversal
        const queue = [node];
        let nodeToDelete = null;
        let lastNode = null;

        while (queue.length) {
            lastNode = queue.shift();
            if (lastNode.value === value) {
                nodeToDelete = lastNode;
            }
            if (lastNode.left) queue.push(lastNode.left);
            if (lastNode.right) queue.push(lastNode.right);
        }

        if (nodeToDelete) {
            const lastValue = lastNode.value;
            this._removeLastNode(node);
            if (nodeToDelete !== lastNode) {
                nodeToDelete.value = lastValue;
            }
        }

        return node;
    }

    _removeLastNode(root) {
        if (!root) return null;

        const queue = [root];
        let prev = null;
        let current = null;

        while (queue.length) {
            current = queue.shift();
            
            if (current.left) {
                prev = current;
                queue.push(current.left);
            }
            if (current.right) {
                prev = current;
                queue.push(current.right);
            }
        }

        if (prev) {
            if (prev.right) prev.right = null;
            else prev.left = null;
        }
    }

    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    _updatePositions() {
        if (!this.root) return;

        const width = Math.pow(2, this._getHeight(this.root)) * this.nodeSpacing;
        this._calculatePositions(this.root, 0, width, 0);
    }

    _calculatePositions(node, x, width, level) {
        if (!node) return;

        node.x = x;
        node.y = level * this.levelHeight;
        node.level = level;

        const offset = width / 2;
        this._calculatePositions(node.left, x - offset, offset, level + 1);
        this._calculatePositions(node.right, x + offset, offset, level + 1);
    }

    _getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    }

    // Traversal methods
    preorderTraversal() {
        const visited = [];
        
        function preorder(node) {
            if (node) {
                // Visit root first
                visited.push(node);
                // Then traverse left subtree
                preorder(node.left);
                // Then traverse right subtree
                preorder(node.right);
            }
        }
        
        preorder(this.root);
        return visited;
    }

    inorderTraversal() {
        const visited = [];
        
        function inorder(node) {
            if (node) {
                // Traverse left subtree first
                inorder(node.left);
                // Then visit root
                visited.push(node);
                // Then traverse right subtree
                inorder(node.right);
            }
        }
        
        inorder(this.root);
        return visited;
    }

    postorderTraversal() {
        const visited = [];
        
        function postorder(node) {
            if (node) {
                // Traverse left subtree first
                postorder(node.left);
                // Then traverse right subtree
                postorder(node.right);
                // Visit root last
                visited.push(node);
            }
        }
        
        postorder(this.root);
        return visited;
    }

    // Observer pattern implementation
    subscribe(callback) {
        this.subscribers.add(callback);
    }
    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.root));
    }

    setMode(isBST) {
        this.isBST = isBST;
        this.root = null; // Clear tree when switching modes
        this.notifySubscribers();
    }
}

class TreeViewController {
    constructor(treeInstance) {
        this.tree = treeInstance;
        this.visualization = document.getElementById('treeVisual');
        this.input = document.getElementById('inputValue');
        this.insertButton = document.getElementById('insertButton');
        this.deleteButton = document.getElementById('deleteButton');
        this.inorderButton = document.getElementById('inorderButton');
        this.preorderButton = document.getElementById('preorderButton');
        this.postorderButton = document.getElementById('postorderButton');
        this.treeModeSwitch = document.getElementById('treeMode');

        if (!this.visualization || !this.input || !this.insertButton || 
            !this.deleteButton || !this.inorderButton || !this.preorderButton || 
            !this.postorderButton || !this.treeModeSwitch) {
            throw new Error('Required DOM elements not found');
        }

        this.initializeEventListeners();
        this.tree.subscribe(this.render.bind(this));
        this.isTraversing = false;
    }

    initializeEventListeners() {
        this.insertButton.addEventListener('click', this.handleInsert.bind(this));
        this.deleteButton.addEventListener('click', this.handleDelete.bind(this));
        this.inorderButton.addEventListener('click', () => this.handleTraversal('inorder'));
        this.preorderButton.addEventListener('click', () => this.handleTraversal('preorder'));
        this.postorderButton.addEventListener('click', () => this.handleTraversal('postorder'));
        this.treeModeSwitch.addEventListener('change', this.handleModeChange.bind(this));
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsert();
            }
        });
    }

    handleInsert() {
        try {
            const value = parseInt(this.input.value);
            this.tree.insert(value);
            this.input.value = '';
            this.showMessage('success', `Successfully inserted ${value}`);
        } catch (error) {
            this.showMessage('error', error.message);
        }
    }

    handleDelete() {
        try {
            const value = parseInt(this.input.value);
            this.tree.delete(value);
            this.input.value = '';
            this.showMessage('success', `Successfully deleted ${value}`);
        } catch (error) {
            this.showMessage('error', error.message);
        }
    }

    async handleTraversal(type) {
        if (this.isTraversing) return;
        this.isTraversing = true;

        const traversalMap = {
            'inorder': () => this.tree.inorderTraversal(),
            'preorder': () => this.tree.preorderTraversal(),
            'postorder': () => this.tree.postorderTraversal()
        };

        const traversalFn = traversalMap[type];
        if (!traversalFn) return;

        try {
            const nodes = traversalFn();
            for (const node of nodes) {
                const nodeElement = document.querySelector(`[data-value="${node.value}"]`);
                if (nodeElement) {
                    // Highlight both node and edges
                    nodeElement.classList.add('highlighted');
                    this._highlightEdges(node);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    nodeElement.classList.remove('highlighted');
                    this._removeHighlightEdges(node);
                }
            }
        } finally {
            this.isTraversing = false;
        }
    }

    // Add these helper methods to TreeViewController
    _highlightEdges(node) {
        const edges = document.querySelectorAll('.tree-edge');
        edges.forEach(edge => {
            const [fromX, fromY] = this._getEdgePosition(edge);
            if (node.x === fromX && node.y === fromY) {
                edge.classList.add('highlighted');
            }
        });
    }

    _removeHighlightEdges(node) {
        const edges = document.querySelectorAll('.tree-edge');
        edges.forEach(edge => {
            edge.classList.remove('highlighted');
        });
    }

    _getEdgePosition(edge) {
        const left = parseInt(edge.style.left) - 30;
        const top = parseInt(edge.style.top) - 30;
        return [left, top];
    }

    handleModeChange(event) {
        this.tree.setMode(event.target.checked);
        this.showMessage('success', `Switched to ${event.target.checked ? 'BST' : 'Binary Tree'} mode`);
    }

    render(root) {
        this.visualization.innerHTML = '';
        if (!root) return;

        const container = document.createElement('div');
        container.className = 'tree-container';
        this.visualization.appendChild(container);

        // Create edges first so they appear behind nodes
        this._renderEdges(root, container);
        this._renderNodes(root, container);
    }

    _renderNodes(node, container) {
        if (!node) return;

        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.textContent = node.value;
        nodeElement.dataset.value = node.value;
        nodeElement.style.left = `${node.x}px`;
        nodeElement.style.top = `${node.y}px`;
        container.appendChild(nodeElement);

        this._renderNodes(node.left, container);
        this._renderNodes(node.right, container);
    }

    _renderEdges(node, container) {
        if (!node) return;

        if (node.left) {
            this._createEdge(node, node.left, container);
        }
        if (node.right) {
            this._createEdge(node, node.right, container);
        }

        this._renderEdges(node.left, container);
        this._renderEdges(node.right, container);
    }

    _createEdge(parent, child, container) {
        const edge = document.createElement('div');
        edge.className = 'tree-edge';

        const deltaX = child.x - parent.x;
        const deltaY = child.y - parent.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        edge.style.width = `${distance}px`;
        edge.style.left = `${parent.x + 30}px`;
        edge.style.top = `${parent.y + 30}px`;
        edge.style.transform = `rotate(${angle}deg)`;

        container.appendChild(edge);
    }

    showMessage(type, message) {
        let messageEl = document.getElementById('treeMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'treeMessage';
            this.visualization.parentNode.insertBefore(messageEl, this.visualization.nextSibling);
        }

        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = '';
        }, 3000);
    }
}

// Initialize the application
try {
    const tree = new BinaryTree();
    const controller = new TreeViewController(tree);

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
    console.error('Failed to initialize tree application:', error);
    const root = document.getElementById('treeVisual')?.parentNode;
    if (root) {
        root.innerHTML = `<div class="error">Failed to initialize tree application: ${error.message}</div>`;
    }
}