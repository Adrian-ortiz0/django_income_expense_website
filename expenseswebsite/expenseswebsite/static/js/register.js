console.log("register js")

const usernameField = document.getElementById("usernameField");
const feedBackArea = document.querySelector(".invalid_feedback");
const emailField = document.getElementById("emailField");
const emailFeedBackArea = document.querySelector(".emailFeedBackArea");
const usernameSuccessOutput = document.querySelector(".usernameSuccessOutput");
const emailSuccessOutput = document.querySelector(".emailSuccessOutput");
const showPasswordToggle = document.querySelector(".showPasswordToggle");
const passwordField = document.getElementById("passwordField");
const submitBtn= document.querySelector(".submit-btn");

const handleToggleInput = (e) => {
    if(showPasswordToggle.textContent === "SHOW"){
        showPasswordToggle.textContent = "HIDE";
        passwordField.setAttribute("type", "text");
    } else {
        showPasswordToggle.textContent = "SHOW";
        passwordField.setAttribute("type", "password");
    }
}

showPasswordToggle.addEventListener("click", handleToggleInput)

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
                submitBtn.disabled=true;
                usernameField.classList.add("is-invalid");
                feedBackArea.style.display = 'block';
                feedBackArea.innerHTML = `<p>${data.username_error}</p>`
            } else {
                submitBtn.removeAttribute('disabled');
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
                submitBtn.disabled=true;
                emailField.classList.add("is-invalid");
                emailFeedBackArea.style.display = 'block';
                emailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`
            } else{
                submitBtn.removeAttribute('disabled');
            }
        }))
    }
})


