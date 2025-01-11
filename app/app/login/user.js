export function logIn(login, password, email){
 return {username: login}
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