const newUserEmail = document.getElementById('useremail1'),
    newPassword = document.getElementById('password1');
    finalUser = JSON.parse(localStorage.getItem('users'));

let signIn = document.getElementById("signInBtn");
signIn.addEventListener("click", () => {
    const filArr = finalUser.filter(user =>
        user.userEmail == newUserEmail.value && user.userPassword == newPassword.value)
    console.log(filArr)
    if(filArr.length > 0){
        alert (`Welcome, you are now logged in`)
    } else {
        alert('username or password incorrect')
    }
})



























// finalUser = JSON.parse(localStorage.getItem('users'));
// const leave = document.querySelector("#logout");

// leave.addEventListener("click", () => {
//     alert("Logged out")
//     // window.location.href = "todologin.html"
// });