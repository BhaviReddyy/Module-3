// app.js
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ================================
// 1. Firebase Config & Init
// ================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MSG_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const booksColRef = collection(db, "books");

// ================================
// 2. DOM Elements
// ================================
const addBookForm = document.getElementById("addBookForm");
const booksContainer = document.getElementById("booksContainer");

// Modal elements
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");

// ================================
// 3. Realtime Listener (READ)
// ================================
// Realtime sync: whenever anything changes in 'books' collection,
// this onSnapshot callback runs and re-renders the UI.
onSnapshot(booksColRef, (snapshot) => {
    const books = [];
    snapshot.forEach((docSnap) => {
        books.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderBooks(books);
});

// ================================
// 4. Render Function
// ================================
function renderBooks(books) {
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        booksContainer.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach((book) => {
        const card = document.createElement("article");
        card.className = "book-card";

        // Card image
        const img = document.createElement("img");
        img.className = "book-cover";
        img.src = book.coverImageURL || "https://via.placeholder.com/300x180?text=No+Image";
        img.alt = book.title || "Book Cover";

        // Card body
        const body = document.createElement("div");
        body.className = "book-body";

        const title = document.createElement("h3");
        title.className = "book-title";
        title.textContent = book.title || "Untitled";

        const author = document.createElement("p");
        author.className = "book-author";
        author.textContent = `by ${book.author || "Unknown"}`;

        const price = document.createElement("p");
        price.className = "book-price";
        price.textContent = book.price ? `₹${book.price}` : "Price not set";

        body.appendChild(title);
        body.appendChild(author);
        body.appendChild(price);

        // Card actions
        const actions = document.createElement("div");
        actions.className = "book-actions";

        const updateBtn = document.createElement("button");
        updateBtn.className = "btn secondary";
        updateBtn.textContent = "Update Author";
        updateBtn.addEventListener("click", () => handleUpdateAuthor(book));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => handleDeleteBook(book.id));

        const viewBtn = document.createElement("button");
        viewBtn.className = "btn outline";
        viewBtn.textContent = "View Details";
        viewBtn.addEventListener("click", () => openDetailsModal(book));

        actions.appendChild(updateBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(viewBtn);

        card.appendChild(img);
        card.appendChild(body);
        card.appendChild(actions);

        booksContainer.appendChild(card);
    });
}

// ================================
// 5. Add Book (CREATE)
// ================================
addBookForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const price = document.getElementById("price").value.trim();
    const imageURL = document.getElementById("imageURL").value.trim();

    if (!title || !author || !price || !imageURL) {
        alert("Please fill all fields");
        return;
    }

    try {
        await addDoc(booksColRef, {
            title,
            author,
            price: Number(price),
            coverImageURL: imageURL,
            createdAt: serverTimestamp()
        });

        // Clear form
        addBookForm.reset();
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. Check console for details.");
    }
});

// ================================
// 6. Update Author (UPDATE)
// ================================
async function handleUpdateAuthor(book) {
    const newAuthor = prompt("Enter new author name:", book.author || "");

    if (newAuthor === null) return; // user cancelled
    const trimmed = newAuthor.trim();
    if (!trimmed) {
        alert("Author name cannot be empty.");
        return;
    }

    try {
        const docRef = doc(db, "books", book.id);
        await updateDoc(docRef, { author: trimmed });
    } catch (error) {
        console.error("Error updating author:", error);
        alert("Failed to update author.");
    }
}

// ================================
// 7. Delete Book (DELETE)
// ================================
async function handleDeleteBook(bookId) {
    const confirmed = confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    try {
        const docRef = doc(db, "books", bookId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book.");
    }
}

// ================================
// 8. View Details Modal
// ================================
function openDetailsModal(book) {
    modalContent.innerHTML = `
    <h3>${book.title || "Untitled"}</h3>
    <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
    <p><strong>Price:</strong> ${book.price ? `₹${book.price}` : "Not set"}</p>
    <p><strong>Image URL:</strong> ${book.coverImageURL || "N/A"}</p>
    <p><strong>Book ID:</strong> ${book.id}</p>
  `;
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});