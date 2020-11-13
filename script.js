// FIREBASE begin

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNBskyv2s_BuXv6afCvoWqvsAy0mYS59g",
    authDomain: "project-pikadu.firebaseapp.com",
    databaseURL: "https://project-pikadu.firebaseio.com",
    projectId: "project-pikadu",
    storageBucket: "project-pikadu.appspot.com",
    messagingSenderId: "519217518119",
    appId: "1:519217518119:web:f2a2bb3ef9f7868a0ca002"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// FIREBASE end

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

const btnNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector('.add-post');

const DEFAULT_PHOTO = userAvatarElem.src;


//One big object with methods for work with the listUsers
const setUsers = {
    user: null,

    initUser(handler) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.user = user;
            } else {
                this.user = null;
            }
            //if handler does not exist => without errors:
            if (handler) {
                handler();
            }
        })
    },

    logIn(email, password, handler) {

        //if handler does not exist => without errors:
        if (handler) {
            handler();
        }

        if(!regExpValidEmail.test(email)) {
            alert('Не валидный email')
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(err => {
                    const errCode = err.code;
                    const errMessage = err.message;
                    if (errCode === 'auth/wrong-password') {
                        console.log(errMessage);
                        alert('Неверный пароль');
                    } else if (errCode === 'auth/user-not-found') {
                        console.log(errMessage);
                        alert('Пользователь не найден');
                    } else {
                        alert(errMessage);
                    }
                });

        // const user = this.getUser(email);

        // if (user && user.password === password) {
        //     this.authorizedUser(user); //authorization
        //     handler(); //change blocks
        // } else {
        //     alert('Пользователь с такими данными не найден');
        // }
    },

    logOut() {
        firebase.auth().signOut();
    },

    signUp(email, password, handler) {

        //if handler does not exist => without errors:
        if (handler) {
            handler();
        }

        if(!regExpValidEmail.test(email)) {
            alert('Не валидный email')
            return;
        }
        
        if (!email.trim() || !password.trim()) {
            alert('Введите данные');
            return;
        }

        firebase.auth()
                .createUserWithEmailAndPassword(email, password) //return promise
                .then((data) => {
                    this.editUser(email.split('@')[0], null, handler);
                })
                .catch(err => {
                    const errCode = err.code;
                    const errMessage = err.message;
                    if (errCode === 'auth/weak-password') {
                        console.log(errMessage);
                        alert('Слабый пароль');
                    } else if (errCode === 'auth/email-already-in-use') {
                        console.log(errMessage);
                        alert('Пользователь с таким email уже существует');
                    } else {
                        alert(errMessage);
                    }
                });



        // if (!this.getUser(email)) { 
        //     const user = {email, password, displayName: email.split('@')[0]}
        //     listUsers.push(user); //add new person
        //     this.authorizedUser(user); //authorization
        //     handler(); //change blocks
        // } else {
        //     alert('Пользователь уже зарегистрирован');
        // }
    },

    editUser(displayName, photoURL, handler) {

        const user = firebase.auth().currentUser;

        if (displayName) {
            if (photoURL) {
                user.updateProfile({
                    displayName,
                    photoURL
                }).then(handler)
            } else {
            user.updateProfile({
                displayName
            }).then(handler)
            }
        }
    },

    // getUser(email) {
    //     return listUsers.find(item => item.email === email)
    // },

    // authorizedUser(user) {
    //     this.user = user;
    // }
}; 

const setPosts = {
    allPosts: [],

    addPost(title, text, tags, handler) {

        this.allPosts.unshift({
            id: `postID${(+new Date()).toString(16)}`,
            title,
            text,
            tags: tags.split(',').map(item => item.trim()),
            author: {
                displayName: setUsers.user.displayName,
                photo: setUsers.user.photoURL,
            },
            data: new Date().toLocaleString(),
            likes: 0,
            comments: 0,
        })

        firebase.database().ref('post').set(this.allPosts)
            .then(() => this.getPosts(handler));
    },

    getPosts(handler) {
        firebase.database().ref('post').on('value', snapshot => {
            this.allPosts = snapshot.val() || [];

            handler();
        })
    },
};

//open login window after authorzation
const toggleAuthDom = () => {
    const user = setUsers.user;

    if (user) {
        loginElem.style.display = 'none';
        userElem.style.display = '';
        userNameElem.textContent = user.displayName;
        userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
        btnNewPost.classList.add('visible');
    } else {
        loginElem.style.display = '';
        userElem.style.display = 'none';
        btnNewPost.classList.remove('visible');
        addPostElem.classList.remove('visible');
        postsWrapper.classList.add('visible');
    }
};

const showAddPost = () => {
    addPostElem.classList.add('visible');
    postsWrapper.classList.remove('visible');
};

//show all posts
const showAllPosts = () => {

    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');

    let postsHTML = '';

    setPosts.allPosts.forEach( ({ title, text, data, tags, likes, comments, author }) => {
        postsHTML += `
                <section class="post">
                <div class="post-body">
                    <h2 class="post-title">${title}</h2>
                    <div class="post-texts">
                        <p class="post-text">${text}
                        </p>
                    </div>
                    <div class="tags">
                        ${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`)}
                    </div>
                </div>
                <div class="post-footer">
                    <div class="post-buttons">
                        <button class="likes post-btn">
                            <svg width="26" height="24" class="icon icon-like">
                                <use xlink:href="img/icons.svg#like"></use>
                            </svg>
                            <span class="likes-counter">${likes}</span>
                        </button>
                        <button class="comments post-btn">
                            <svg width="26" height="24" class="icon icon-comments">
                                <use xlink:href="img/icons.svg#comment"></use>
                            </svg>
                            <span class="comments-counter">${comments}</span>
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
                            <a href="#" class="author-username">${author.displayName}</a>
                            <span class="post-time">${data}</span>
                        </div>
                        <a href="#" class="author-link">
                            <img class="author-avatar" src=${author.photo || "img/person.jpg"} alt="avatar">
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
        setUsers.logOut();
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

    btnNewPost.addEventListener('click', (e) => {
        e.preventDefault();
        showAddPost();
    });

    addPostElem.addEventListener('submit', (e) => {
        e.preventDefault();
        const { title, text, tags } = addPostElem.elements;

        if (title.value.length < 6) {
            alert ('Слишком короткий заголовок');
            return;
        }

        if (text.value.length < 50) {
            alert ('Слишком короткий пост');
            return;
        }

        setPosts.addPost(title.value, text.value, tags.value, showAllPosts);

        addPostElem.classList.remove('visible');
        addPostElem.reset();
    });



    setUsers.initUser(toggleAuthDom);
    setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});








