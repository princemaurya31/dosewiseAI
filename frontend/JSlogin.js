async function validateLogin() {
    event.preventDefault();   // 🔥 important

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const response = await fetch("https://dosewiseai.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            alert("Login Successful ✅");

            // 🔥 Redirect
            window.location.href = "ui.html";

        } else {
            alert(data.message);
        }

    } catch (error) {
        alert("Server Error");
        console.log(error);
    }
}