export function logIn(login, password) {

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[login] && users[login].password === password) {
        return { userId: users[login].userId, username: login };
    }

    const newUser = {
        userId: Date.now(), 
        username: login,
        password: password,
    };

    users[login] = newUser; 
    localStorage.setItem("users", JSON.stringify(users));
    return { userId: newUser.userId, username: login };
}
export function currentUser(){
    const userData = localStorage.getItem("user");
    if (!userData){
        return null;
    }
    return JSON.parse(userData)
}

export function logout(){
    localStorage.removeItem("user")
}