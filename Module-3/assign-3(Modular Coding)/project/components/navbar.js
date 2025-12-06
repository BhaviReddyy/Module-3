export default function navbar(showLogout = false) {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class= "nav-left"><a href="index.html" class=brand>MyApp</a></div>
        <div class="nav-right">
            <a href="index.html">Home</a>
            <a href="signup.html">Signup</a>
            <a href="todos.html">Todos</a>
        </div>
        `;

    if (showLogout) {
        const btn = document.createElement("button");
        btn.className = "btn small";
        btn.textContent = "Logout";
        btn.addEventListener('click', () => {
            localStorage.removeItem('loggerInUser');

            location.href = 'log.html'
        });
        nav.querySelector('.nav-right').appendChild(btn);
    }

    return nav;
}