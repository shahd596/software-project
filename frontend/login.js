const form = document.getElementById("loginForm");



function handleSuccessLogin(json) {
    localStorage.setItem("token", json.accessToken);
    localStorage.setItem("username", json.username);
    localStorage.setItem("userId", json._id);
    localStorage.setItem("isAdmin", json.isAdmin);

    showSuccessAlert("Login successful");
    showLoggedInUser();

    setTimeout(() => {
        window.location.href = "/products.html";
    }, 1200);
}

async function sendData() {
    const formData = {};

    for (const [key, value] of (new FormData(form)).entries()) {
        formData[key] = value;
    }

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const json = await response.json();
            handleSuccessLogin(json);

        } else {
            showFailedAlert("Wrong username or password");
        }

    } catch (e) {
        console.error(e);
        showFailedAlert("Wrong username or password");
    }
}

// Take over form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
});
