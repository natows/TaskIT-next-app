export function logIn(login, password) {
    const users = JSON.parse(localStorage.getItem("users")) || {}; 

    if (users[login]) {
        if (users[login].password === password) {
            const currentUserData = {
                userId: users[login].userId,
                username: login,
                isAdmin: users[login].role === "admin",
            };

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
            role: "regular",
        };

        users[login] = newUser;
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem(newUserId, JSON.stringify({ tasksByDate: {} }));

        const currentUserData = {
            userId: newUserId,
            username: login,
            isAdmin: false,
        };

        localStorage.setItem("user", JSON.stringify(currentUserData));
        return currentUserData;
    }
}

export function currentUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
}

export function logout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage")); 
}
