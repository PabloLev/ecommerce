let userName = document.getElementById("nameRegister"),
    userEmail = document.getElementById("emailRegister"),
    userPassword = document.getElementById("passwordRegister"),
    userPasswordConfirm = document.getElementById("passwordConfirm"),
    finalUser = JSON.parse(localStorage.getItem('users'));
function addUser(e){
    e.preventDefault();
    if (userPassword.value !== userPasswordConfirm.value) {
        alert("Confirm password fail, try again");
    }else{
        if (userName.value === "" || userEmail.value === "" || userPassword.value === "") {
            alert("Please complete all fields");
            return false;
        }
        let userInfo = { //Agrego los valores al objeto userInfo
            userName: userName.value,
            userEmail: userEmail.value,
            userPassword: userPassword.value
        }
        let theUsers=[]; //Creo el array que contiene los objetos userInfo
        if(localStorage.getItem('users') == null){
            console.log("Users estaba vacio");
            theUsers.push(userInfo);
            localStorage.setItem('users', JSON.stringify(theUsers)) //Guardo key: users, value: theUsers
        }else{
            console.log("Ya hay usuarios creados");
            console.log(theUsers);
            theUsers = JSON.parse(localStorage.getItem('users')); //levanto el array de objetos guardado
            theUsers.push(userInfo); //Guardo el nuevo elemento
            localStorage.setItem('users', JSON.stringify(theUsers)) //lo vuelvo a guardar
        }
        console.log(theUsers);
        alert(userInfo.userName + " te has registrado correctamente!!!");
    }
};
document.getElementById('registerForm').addEventListener('submit', addUser);















        // let myModal = document.getElementById('modalFormRegister');
        // myModal.hide();