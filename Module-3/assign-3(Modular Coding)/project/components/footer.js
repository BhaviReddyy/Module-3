export default function footer() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div>@ ${new Date().getFullYear()} Modular App - Demo</div>
    `;
    return footer;
}