// app state
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let editingId = null;
let deleteId = null;

// dom elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const filters = document.querySelector('.filters');
const counter = document.querySelector('.task-counter');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-confirm-modal');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');

// helper fn to update counter
function updateCounter() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    counter.textContent = `${done}/${total} úloh`;
}

// save to localStorage
function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateCounter();
}

// create todo element - pozn.: trochu chaos ale funguje 
function createTodoEl(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.classList.add('adding');

    // TODO: refactor this html mess later
    li.innerHTML = `
        <div class="todo-content">
            <div class="checkbox-wrapper" onclick="toggleTodo(${todo.id})">
                <div class="checkbox">
                    <svg viewBox="0 0 16 16">
                        <path d="M3.5 8.5l3 3 6-6" fill="none"/>
                    </svg>
                </div>
            </div>
            <span class="todo-text">${todo.text}</span>
        </div>
        <div class="todo-actions">
            <button class="edit-btn" onclick="startEdit(${todo.id})">
                ✎
            </button>
            <button class="delete-btn" onclick="showDeleteModal(${todo.id})">
                ×
            </button>
        </div>
    `;

    // remove animation class
    setTimeout(() => li.classList.remove('adding'), 300);

    return li;
}

// render todos based on filter
function render() {
    // quick filter using ternary - not the most readable but works fine
    const filtered = currentFilter === 'all' ? todos :
        currentFilter === 'active' ? todos.filter(t => !t.completed) :
            todos.filter(t => t.completed);

    list.innerHTML = '';
    filtered.forEach(todo => {
        list.appendChild(createTodoEl(todo));
    });
}

// add new todo
form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        const todo = {
            id: Date.now(), // not perfect but works for demo
            text,
            completed: false
        };
        todos.unshift(todo); // add to start
        input.value = '';
        save();
        render();
    }
});

// toggle todo state
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        save();
        render();
    }
}

// edit stuff
function startEdit(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        editingId = id;
        editInput.value = todo.text;
        editModal.classList.add('active');
        editInput.focus();
    }
}

function closeEditModal() {
    editModal.classList.remove('active');
    editingId = null;
    editInput.value = '';
}

editForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = editInput.value.trim();
    if (text && editingId) {
        const todo = todos.find(t => t.id === editingId);
        if (todo) {
            todo.text = text;
            save();
            render();
            closeEditModal();
        }
    }
});

// delete stuff
function showDeleteModal(id) {
    deleteId = id;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteId = null;
}

function deleteTodo() {
    if (!deleteId) return;

    const todoEl = list.querySelector(`[onclick*="${deleteId}"]`).closest('.todo-item');
    todoEl.classList.add('removing');

    setTimeout(() => {
        todos = todos.filter(t => t.id !== deleteId);
        save();
        render();
        closeDeleteModal();
    }, 300);
}

// event listeners for modals
document.getElementById('cancel-edit').onclick = closeEditModal;
document.getElementById('confirm-delete').onclick = deleteTodo;
document.getElementById('cancel-delete').onclick = closeDeleteModal;

// handle filters
filters.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        // update active state
        document.querySelector('.filters .active').classList.remove('active');
        e.target.classList.add('active');

        currentFilter = e.target.dataset.filter;
        render();
    }
});

// close modals on outside click
window.addEventListener('click', e => {
    if (e.target === editModal) closeEditModal();
    if (e.target === deleteModal) closeDeleteModal();
});

// init app
render();
updateCounter();

// hotkeys for testing
// document.addEventListener('keydown', e => {
//     if (e.key === 'q') console.log(todos);
// });