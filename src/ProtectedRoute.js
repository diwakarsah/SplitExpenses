import React, {useContext} from 'react';
import {Route,Redirect} from 'react-router-dom';
import { loginContext } from './Pages/service/Contexts';


export const ProtectedRoute =({component: Component, ...rest})=>{


    let sessionContext= useContext(loginContext);
    return(
        <Route
            {...rest}
        render = {props=>{
            let isAuthentication = sessionContext.stateData;
            if(isAuthentication)
            {
                return <Component {...props}/>}
            else
            {
                return <Redirect
                to = {
                    {
                        pathname : "/Login",
                        state:{
                            from:props.location
                        }
                    }
                }/>}
            ;}}/>
    )

};
