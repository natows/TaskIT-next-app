
export function logIn(login, password) {
   
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[login]) {
        const storedPassword = users[login].password; 
        if (storedPassword === password) { 
            const currentUserData = { userId: users[login].userId, username: login };
            localStorage.setItem("user", JSON.stringify(currentUserData));
            return currentUserData;
        } else {
            throw new Error("Invalid password");
        }
    } else {
        
        const newUserId = Date.now().toString();
        const newUser = {
            userId: newUserId,
            username: login,
            password: password,
        };

        
        users[login] = newUser;
        localStorage.setItem("users", JSON.stringify(users));

        
        localStorage.setItem(newUserId, JSON.stringify({ tasksByDate: {} }));

        const currentUserData = { userId: newUserId, username: login };
        localStorage.setItem("user", JSON.stringify(currentUserData));
        return currentUserData;
    }
}


export function currentUser() {
    const userData = localStorage.getItem("user");
    if (!userData) {
        return null;
    }
    return JSON.parse(userData);
}


export function logout() {
    localStorage.removeItem("user"); 
}
