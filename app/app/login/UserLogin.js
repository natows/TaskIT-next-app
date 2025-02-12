export function logIn(login, password, logUserActivity) {
    const users = JSON.parse(localStorage.getItem("users")) || {}; 

    if (users[login]) {
        if (users[login].password === password) {
            const currentUserData = {
                userId: users[login].userId,
                username: login,
                isAdmin: users[login].role === "admin",
            };

            localStorage.setItem("user", JSON.stringify(currentUserData));
            logUserActivity(`User ${login} logged in`);
            return currentUserData;
        } else {
            throw new Error("Invalid password");
        }
    } else {
        throw new Error("User does not exist");
    }
}

export function signIn(email, password, logUserActivity) {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
        throw new Error("User already exists");
    }

    const newUserId = Date.now().toString();
    const newUser = {
        userId: newUserId,
        username: email,
        password: password,
        role: "regular",
    };

    users[email] = newUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem(newUserId, JSON.stringify({ tasksByDate: {} }));

    const currentUserData = {
        userId: newUserId,
        username: email,
        isAdmin: false,
    };

    localStorage.setItem("user", JSON.stringify(currentUserData));
    logUserActivity(`User ${email} registered and logged in`);
    return currentUserData;
}

export function currentUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
}

export function logout(logUserActivity) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    
    if (currentUser) {
        logUserActivity(`User ${currentUser.username} logged out`);
    }
    
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
}
