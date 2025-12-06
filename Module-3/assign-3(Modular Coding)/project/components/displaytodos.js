export function displayTodos(data, container) {
    container.innrHtml = "";

    if (!Array.isArray(data) || data.length === 0) {
        container.innrHtml = `<p class="muted">No todos to show.</p>`;
        return
    }

    const list = data.slice(0, 20)

    list.forEach(todo => {
        const card = document.createElement('div');
        card.className = 'todo-card';
        card.innerHTML = `
            <h4>${escapeHtml(todo.title)}</h4>
            <p><strong>ID:</strong> ${todo.id}</p>
            <p><strong>Completed:</strong> ${todo.completed ? 'true': 'false'}</p>
        `;
        container.appendChild(card);
    });
}

function escapeHtml(str) {
    return String(str || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}