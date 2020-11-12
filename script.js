//CLOSE/OPEN SIDEBAR WITH BURGERMENU
const close = document.querySelector('.menu-active');
const menu = document.querySelector('.sidebar');

close.addEventListener('click', (e) => {
    menu.classList.toggle('visible');
});


const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');

const exitElem = document.querySelector('.exit');
const editContainer = document.querySelector('.edit-container');
const editElem = document.querySelector('.edit');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');


const listUsers = [
    {
        email: 'tany@mail.ru',
        password: '12345',
        displayName: 'TanyJunior'
    },
    {
        email: 'max@mail.ru',
        password: '12345',
        displayName: 'MaxJunior'
    },
    {
        email: 'nick@mail.ru',
        password: '12345',
        displayName: 'NickJunior'
    },

];

//One big object with methods for work with the listUsers
const setUsers = {
    user: null,

    logIn(email, password, handler) {

        if(!regExpValidEmail.test(email)) {
            alert('Не валидный email')
            return;
        }

        const user = this.getUser(email);

        if (user && user.password === password) {
            this.authorizedUser(user); //authorization
            handler(); //change blocks
        } else {
            alert('Пользователь с такими данными не найден');
        }
    },

    logOut(handler) {
        this.user = null;
        handler(); //change blocks
    },

    signUp(email, password, handler) {

        if(!regExpValidEmail.test(email)) {
            alert('Не валидный email')
            return;
        }
        
        if (!email.trim() || !password.trim()) {
            alert('Введите данные');
            return;
        }

        if (!this.getUser(email)) { 
            const user = {email, password, displayName: email.split('@')[0]}
            listUsers.push(user); //add new person
            this.authorizedUser(user); //authorization
            handler(); //change blocks
        } else {
            alert('Пользователь уже зарегистрирован');
        }
    },

    editUser(userName, userPhoto, handler) {
        if (userName) {
            this.user.displayName = userName;
        }

        if (userPhoto) {
            this.user.photo = userPhoto;
        }

        handler();
    },

    getUser(email) {
        return listUsers.find(item => item.email === email)
    },

    authorizedUser(user) {
        this.user = user;
    }
}; 

//open login window after authorzation
const toggleAuthDom = () => {
    const user = setUsers.user;
    console.log('user ', user);

    if (user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
        userAvatarElem.src = user.photo || userAvatarElem.src;
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
    }

};





loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
    loginForm.reset();
});

loginSignup.addEventListener('click', (e) => {
    e.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
    loginForm.reset();
});

exitElem.addEventListener('click', (e) => {
    e.preventDefault();
    setUsers.logOut(toggleAuthDom);
});

editElem.addEventListener('click', (e) => {
    e.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
});

editContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible')

});


toggleAuthDom();