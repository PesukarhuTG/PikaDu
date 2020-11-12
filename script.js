//CLOSE/OPEN SIDEBAR WITH BURGERMENU
const close = document.querySelector('.menu-active');
const menu = document.querySelector('.sidebar');

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

const postsWrapper = document.querySelector('.posts');


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

const setPosts = {
    allPosts: [
        {
            title: 'Истоки лидерства',
            text: 'Придерживаясь жестких принципов социального Дарвинизма, предсознательное зеркально отталкивает гештальт. Чувство вызывает социометрический гештальт.',
            tags: ['свежее', 'социум', 'психология', 'личностныйрост', 'гештальт'],
            author: 'tany@mail.ru',
            data: '11.11.2020, 20:54:00',
            likes: 15,
            comments: 20,
        },

        {
            title: 'Маркетинг в наши дни',
            text: 'Агентская комиссия позиционирует эмпирический комплексный анализ ситуации, не считаясь с затратами. Спонсорство поддерживает бренд. Продукт, как принято считать, стабилизирует целевой трафик. Продуктовый ассортимент концентрирует культурный SWOT-анализ.',
            tags: ['маркетинг', 'анализ', 'развитие', 'promotion'],
            author: 'max@mail.ru',
            data: '07.11.2020, 15:20:00',
            likes: 47,
            comments: 5,
        },

        {
            title: 'Жидкофазный катионит — актуальная национальная задача',
            text: 'Гибридизация, в согласии с традиционными представлениями, различна. Комплекс рения с саленом, в первом приближении, ковалентно выпадает сернистый газ. Диэтиловый эфир представляет собой полимерный белок.',
            tags: ['химия', 'анализ', 'молекула', 'белок', 'трансформация'],
            author: 'nick@mail.ru',
            data: '17.06.2020, 18:53:00',
            likes: 17,
            comments: 2,
        }

    ],


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

//show all posts
const showAllPosts = () => {

    let postsHTML = '';

    setPosts.allPosts.forEach( post => {
        postsHTML += `
                <section class="post">
                <div class="post-body">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-texts">
                        <p class="post-text">${post.text}
                        </p>
                    </div>
                    <div class="tags">
                        <a href="#" class="tag">${post.tags}</a>
                    </div>
                </div>
                <div class="post-footer">
                    <div class="post-buttons">
                        <button class="likes post-btn">
                            <svg width="26" height="24" class="icon icon-like">
                                <use xlink:href="img/icons.svg#like"></use>
                            </svg>
                            <span class="likes-counter">${post.likes}</span>
                        </button>
                        <button class="comments post-btn">
                            <svg width="26" height="24" class="icon icon-comments">
                                <use xlink:href="img/icons.svg#comment"></use>
                            </svg>
                            <span class="comments-counter">${post.comments}</span>
                        </button>
                        <button class="save post-btn">
                            <svg width="24" height="24" class="icon icon-save">
                                <use xlink:href="img/icons.svg#save"></use>
                            </svg>
                        </button>
                        <button class="share post-btn">
                            <svg width="24" height="24" class="icon icon-share">
                                <use xlink:href="img/icons.svg#share"></use>
                            </svg>
                        </button>
                    </div>
                    <div class="post-authors">
                        <div class="author-about">
                            <a href="#" class="author-username">${post.author}</a>
                            <span class="post-time">${post.data}</span>
                        </div>
                        <a href="#" class="author-link">
                            <img class="author-avatar" src="img/person.jpg" alt="avatar">
                        </a>
                    </div>
                </div>
            </section>
        `;
    });

    postsWrapper.innerHTML = postsHTML;
}


//for init all main functions and events
const init = () => {

    close.addEventListener('click', (e) => {
        menu.classList.toggle('visible');
    });

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
    
    showAllPosts();
    toggleAuthDom();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
})




