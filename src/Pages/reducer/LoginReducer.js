import {setSessionCookie, removeSession, getSessionCookie} from "../service/CookiesHandler";


const LoginReducer = (state,action)=>{
    switch (action.type) {
        case 'Login':
            setSessionCookie(action.payload);
            return ( getSessionCookie())
        case 'Logout':
            sessionStorage.clear();
           removeSession();
            return (getSessionCookie());
        default:
            return state
    }
}
export default LoginReducer;
