import * as Cookies from "js-cookie";
export const setSessionCookie = (session) => {
    var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.remove("session");
    sessionStorage.clear();
    Cookies.set("session", session, { expires: inFifteenMinutes });
};

export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");

    if (sessionCookie === undefined) {
        return false;
    } else {
        return JSON.parse(sessionCookie);

    }
};

export const removeSession=()=>{Cookies.remove("session")};
