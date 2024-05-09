const form = document.getElementById("createProduct");

async function sendData() {
    const formData = {};

    for (const [key, value] of (new FormData(form)).entries()) {
        formData[key] = value;
    }

    try {
        console.log(formData);
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            const json = await response.json();
            showSuccessAlert("Product created successfully");
            window.location.href = "/products.html";
        } else {
            showFailedAlert("Failed to create product");
        }

    } catch (e) {
        console.error(e);
        showFailedAlert("Failed to create product");
    }
}

// Take over form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
});

