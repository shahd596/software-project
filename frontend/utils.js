function hideElementWithChildren(element) {
    element.style.display = "none";
    if (element.children.length > 0) {
        for (const child of element.children) {
            hideElementWithChildren(child);
        }
    }
}   

function showElementWithChildren(element) {
    element.style.display = "block";
    if (element.children.length > 0) {
        for (const child of element.children) {
            showElementWithChildren(child);
        }
    }
}

function showLoggedInUser() {
    const username = localStorage.getItem("username");
    if (!username) {
        return;
    }

    const navbarLogin = document.getElementById("navbar-login");
    navbarLogin.getElementsByClassName("nav-link")[0].innerText = "Logout";

    const navbarUsername = document.getElementById("navbar-username");
    navbarUsername.getElementsByClassName("navbar-text")[0].innerText = `Welcome ${username}`;
    showElementWithChildren(navbarUsername);
}

function logout() {
    localStorage.clear();
    
    const navbarLogin = document.getElementById("navbar-login");
    navbarLogin.getElementsByClassName("nav-link")[0].innerText = "Login";

    const navbarUsername = document.getElementById("navbar-username");
    hideElementWithChildren(navbarUsername);
}

function loginOrLogout(){
    const navbarLogin = document.getElementById("navbar-login");
    if (navbarLogin.getElementsByClassName("nav-link")[0].innerText === "Logout") {
        logout();
    } else {
        window.location.href = "/login.html";
    }
}


function createAlertElement() {
    const div = document.createElement('div');
    div.classList.add("alert", "show");
    div.id = "globalAlert";
    div.style.minWidth = '30rem';
    div.style.zIndex = 9999;
    div.style.position = 'fixed';
    div.style.top = '10%';
    div.style.right = '1%';
    return div;
}

function showSuccessAlert(message) {
    const alert = createAlertElement();
    alert.classList.add("alert-success");
    alert.innerText = message;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showFailedAlert(message) {
    const alert = createAlertElement();
    alert.classList.add("alert-danger");
    alert.innerText = message;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function updateCartCountInNavbar() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const navbarCart = document.getElementById('navbar-cart');
    navbarCart.innerText = `Cart (${Object.keys(cart).length})`;
}

showLoggedInUser();
updateCartCountInNavbar();
