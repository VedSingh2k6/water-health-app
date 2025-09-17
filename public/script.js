// Mock users database
const mockUsers = {
    "asha": { email: "asha@example.com", password: "123" },
    "official": { email: "govt@example.com", password: "123" },
    "community": { email: "user@example.com", password: "123" }
};

// Login function
async function login(e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(!role || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if(mockUsers[role] && mockUsers[role].email === email && mockUsers[role].password === password){
        localStorage.setItem("role", role);
        alert("Login successful! Redirecting...");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}

// Attach login to form
document.getElementById("loginForm").addEventListener("submit", login);
