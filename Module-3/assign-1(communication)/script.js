// ------------ Fetch Todos and Save first 20 to LocalStorage ------------------
async function fetchTodos() {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await res.json();

    const first20 = data.slice(0, 20);
    localStorage.setItem("todos", JSON.stringify(first20));

    renderTodos();
}

// ------------ Get Todos from Local Storage ------------------
function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

// ------------ Save Todos back to Local Storage ------------------
function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// ------------ Delete Specific Todo ------------------
function deleteTodo(id) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);

    saveTodos(todos);
    renderTodos();
}

// ------------ Toggle Completed Status ------------------
function toggleTodo(id) {
    let todos = getTodos();

    todos = todos.map(todo => {
        if (todo.id === id) {
            return {...todo, completed: !todo.completed };
        }
        return todo;
    });

    saveTodos(todos);
    renderTodos();
}

// ------------ Render Todos to UI ------------------
function renderTodos() {
    const list = document.getElementById("todo-list");
    const message = document.getElementById("empty-message");

    const todos = getTodos();

    list.innerHTML = ""; // Clear UI first

    if (todos.length === 0) {
        message.classList.remove("hidden");
        return;
    } else {
        message.classList.add("hidden");
    }

    todos.forEach(todo => {
        const div = document.createElement("div");
        div.className = "todo";

        div.innerHTML = `
            <span class="todo-title ${todo.completed ? 'completed' : ''}">
                ${todo.title}
            </span>
            <button class="toggle-btn" onclick="toggleTodo(${todo.id})">
                ${todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                Delete
            </button>
        `;

        list.appendChild(div);
    });
}

// ------------ Initialize App ------------------
if (!localStorage.getItem("todos")) {
    fetchTodos();
} else {
    renderTodos();
}