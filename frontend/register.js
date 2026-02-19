async function registerUser(event){
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(password.length < 6){
        alert("Password must be at least 6 characters");
        return;
    }

    try{
        const response = await fetch("https://dosewiseai.onrender.com/api/auth/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if(response.ok){
            alert("Registration Successful ✅");
            window.location.href = "login.html";
        }else{
            alert(data.message);
        }

    }catch(error){
        alert("Server Error");
        console.log(error);
    }
}