let userName = document.getElementById("nameRegister"),
    userEmail = document.getElementById("emailRegister"),
    userPassword = document.getElementById("passwordRegister"),
    userPasswordConfirm = document.getElementById("passwordConfirm"),
    finalUser = JSON.parse(localStorage.getItem('users'));
// REGISTER
function addUser(e){
    e.preventDefault();
    if (userPassword.value !== userPasswordConfirm.value) {
        alert("Confirm password fail, try again");
    }else{
        if (userName.value === "" || userEmail.value === "" || userPassword.value === "") {
            alert("Please complete all fields");
            return false;
        }
        let userInfo = { 
            userName: userName.value,
            userEmail: userEmail.value,
            userPassword: userPassword.value,
            userLoged: true
        }
        let theUsers=[]; 
        if(localStorage.getItem('users') == null){
            console.log("Users estaba vacio");
            theUsers.push(userInfo);
            localStorage.setItem('users', JSON.stringify(theUsers)); 
            logedIconName(userInfo.userName);
        }else{
            console.log("Ya hay usuarios creados");
            console.log(theUsers);
            theUsers = JSON.parse(localStorage.getItem('users')); 
            theUsers.push(userInfo); 
            localStorage.setItem('users', JSON.stringify(theUsers));
            logedIconName(userInfo.userName);
        }
        console.log(theUsers);
        alert(userInfo.userName + " te has registrado correctamente!!!");
    }
};
document.getElementById('registerForm').addEventListener('submit', addUser);



const newUserEmail = document.getElementById('useremail1'),
    newPassword = document.getElementById('password1');
// SIGNIN
let signIn = document.getElementById("signInBtn");
signIn.addEventListener("click", () => {
    // console.log(finalUser);
    if(finalUser === null){
        alert('Create an user please')
    }else{
        const filArr = finalUser.filter(user =>
            user.userEmail == newUserEmail.value && user.userPassword == newPassword.value)
        
        if(filArr.length > 0){
            let nameIcon = filArr[0].userName;
            alert ("Welcome " + nameIcon.toUpperCase() + ", you are now logged in")
            logedIconName(nameIcon);
        } else {
            alert('username or password incorrect')
        }
    }
    
})

// NOMBRE AL ICONO USUARIO
function logedIconName(name){
    let userBtn = document.querySelector('#userBtn span');
    userBtn.classList.add('p-3');
    userBtn.textContent = name.toUpperCase();
}











        // let myModal = document.getElementById('modalFormRegister');
        // myModal.hide();