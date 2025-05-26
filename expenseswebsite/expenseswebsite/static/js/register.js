console.log("register js")

const usernameField = document.getElementById("usernameField");
const feedBackArea = document.querySelector(".invalid_feedback");
const emailField = document.getElementById("emailField");
const emailFeedBackArea = document.querySelector(".emailFeedBackArea");
const usernameSuccessOutput = document.querySelector(".usernameSuccessOutput");
const emailSuccessOutput = document.querySelector(".emailSuccessOutput");

usernameField.addEventListener("keyup", (e) => {
    const usernameVal = e.target.value;
    usernameSuccessOutput.textContent = `Checking ${usernameVal}`

    usernameField.classList.remove("is-invalid");
    feedBackArea.style.display = 'none';

    if(usernameVal.length > 0){
        fetch('/authentication/validate-username', {
            body:JSON.stringify({username: usernameVal}), 
            method: "POST"
        })
        .then((res) => res.json()
        .then((data) => {
            usernameSuccessOutput.style.display = 'none';
            if(data.username_error){
                usernameField.classList.add("is-invalid");
                feedBackArea.style.display = 'block';
                feedBackArea.innerHTML = `<p>${data.username_error}</p>`
            }
        }))
    }
});

emailField.addEventListener("keyup", (e) => {
    const emailVal = e.target.value;
    emailSuccessOutput.textContent = `Checking ${emailVal}`

    emailField.classList.remove("is-invalid");
    emailFeedBackArea.style.display = 'none';

    if(emailVal.length > 0){
        fetch('/authentication/validate-email', {
            body:JSON.stringify({email: emailVal}), 
            method: "POST"
        })
        .then((res) => res.json()
        .then((data) => {
            emailSuccessOutput.style.display = 'none';
            if(data.email_error){
                emailField.classList.add("is-invalid");
                emailFeedBackArea.style.display = 'block';
                emailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`
            }
        }))
    }
})


