//CLOSE/OPEN SIDEBAR WITH BURGERMENU
const close = document.querySelector('.menu-active');
const menu = document.querySelector('.sidebar');

close.addEventListener('click', (e) => {
    menu.classList.toggle('visible');
});

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');

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
        const user = this.getUser(email);
        if (user && user.password === password) {
            this.authorizedUser(user); //authorization
            handler(); //change blocks
        } else {
            alert('Пользователь с такими данными не найден');
        }
    },

    logOut() {
        console.log('выход');
    },

    signUp(email, password, handler) {
        if (!this.getUser(email)) { 
            const user = {email, password, displayName: email.split('@')[0]}
            listUsers.push(user); //add new person
            this.authorizedUser(user); //authorization
            handler(); //change blocks
        } else {
            alert('Пользователь уже зарегистрирован');
        }
    },

    getUser(email) {
        return listUsers.find(item => item.email === email)
    },

    authorizedUser(user) {
        this.user = user;
    }
}; 

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
});

loginSignup.addEventListener('click', (e) => {
    e.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
});

//open login window after authorzation
const toggleAuthDom = () => {
    const user = setUsers.user;
    console.log('user ', user);

    if (user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
    }

}


toggleAuthDom();