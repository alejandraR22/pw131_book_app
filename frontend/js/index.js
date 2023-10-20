const API_URL ="http://127.0.0.1:5000";

const init = () => {
console.log("init");

    const registerForm = document.getElementById("register-form");
    const handleRegister = async (event) => {
        event.preventDefault();
        const usernameElement = event.target.querySelector("#username");
        const username = usernameElement.value;

        const passwordElement = event.target.querySelector("#password");
        const password = passwordElement.value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await res.json();

        console.log(data);
    };
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    const loginForm = document.getElementById("login-form");
    const handleLogin = async (event) => {
        event.preventDefault();
        const usernameElement = event.target.querySelector("#username");
        const username = usernameElement.value;

        const passwordElement = event.target.querySelector("#password");
        const password = passwordElement.value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await res.json();

        console.log(data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
    };
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const createBookCard = (book) => {
        return `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${book.created_by}</h6>
                <p class="card-text">${book.description}</p>
                ${
                    localStorage.getItem("username") === book.created_by
                        ? `<button class="btn btn-warning" id="edit-book" data-id=${book.id}>Edit</button>
                            <button class="btn btn-danger" id="delete-book" data-id=${book.id}>Delete</button>`
                        : ""
                }
            </div>
        </div>`;
    };


    const handleGetAllBooks = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/book/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();

        console.log(data);

        let cardsHTML;
        data.books.forEach((book) => {
            cardsHTML += createBookCard(book);
        });
        const bookDisplay = document.getElementById("book-display");
        if (bookDisplay) {
            bookDisplay.innerHTML = cardsHTML;
        }

        const editButtons = document.querySelectorAll("button[data-id]#edit-book");

        editButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".card");
                const titleElement = card.querySelector(".card-title");
                const descriptionElement = card.querySelector(".card-text");

                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = titleElement.innerText;

                const descriptionInput = document.createElement("input");
                descriptionInput.type = "text";
                descriptionInput.value = descriptionElement.innerText;

                console.log(titleInput, descriptionInput);

                titleElement.replaceWith(titleInput);
                descriptionElement.replaceWith(descriptionInput);

                const saveBtn = document.createElement("button");
                saveBtn.innerText = "Save";
                saveBtn.classList.add("btn", "btn-success");
                saveBtn.addEventListener("click", async () => {
                    const res = await fetch(`${API_URL}/book/update/${book.id}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: titleInput.value,
                            description: descriptionInput.value,
                        }),
                    });

                    if (res.ok) {
                        window.location.reload();
                    }
                });

                btn.insertAdjacentElement("afterend", saveBtn);
            });
        });

        const deleteButtons = document.querySelectorAll("button[data-id]#delete-book");

        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();

                const bookId = btn.getAttribute("data-id");

                const res = await fetch(`${API_URL}/book/delete/${bookId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res.ok) {
                    window.location.reload();
                }
            });
        });
    };
    const getBooksButton = document.getElementById("get-books");
    if (getBooksButton) {
        getBooksButton.addEventListener("click", handleGetAllBooks);
    }

}
document.addEventListener("DOMContentLoaded", init);