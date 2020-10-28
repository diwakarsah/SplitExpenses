import React, {useContext, useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import { loginContext } from './service/Contexts';

import {FetchingLoginInfo} from './service/Login&ResgisterHandler';
import {useForm} from "./service/useForm";
import LoaderScreen from "./Model/LoaderScreen";



const LoginPage = (props)=>{

    let formData={userName:"",password:""};

    const [errors,setError] = useState(null);
    const sessionContext= useContext(loginContext);

    const [isLoading,setIsLoading] = useState(false);



    const onLogin= (value)=>{
        // setIsLoading(true);
        FetchingLoginInfo('/authenticate', formField,'post').then(result => {
                console.log("test",result.message)
                if(result.ok === false)
                {
                    setError("Username or password didn't match");
                    setIsLoading(false);

                }
                else if (typeof result.message === 'undefined' && typeof result.jwt !== 'undefined' ) {
                    const sessionData = {"jwt":result.jwt,"isAuthenticated":true,username:formField.userName};
                    sessionContext.dispatch({type:'Login',payload:sessionData});
                    props.history.push("/home")
                }
                else
                {
                    setError(result.message);
                    setIsLoading(false);
                }

            }).catch(error=>{console.log("catch",error)});

    };

    const validateLogin = (formField)=>{
        let error = {};
        if (formField.userName === "")
        {
            error.userName ="Please enter Email";
        }
        if (formField.password === "")
        {
            error.password ="Please enter Password";
        }
        return error;
    };

    const {formField,error,changeFormField,handleSubmit,handleOnChange} = useForm(onLogin, formData,validateLogin);

 // useEffect(()=>{console.log("isloading",isLoading)},[isLoading])
 //    if(isLoading)
 //    {
 //        return <LoaderScreen />
 //    }

    return(
        <div className="login-form  ">
            {isLoading?<LoaderScreen />:
            <div className="form-container ">

            <form>
                <div className="login-header">
                <span className="login100-form-title p-b-26">
						Welcome
					</span>
                    <span className="login100-form-title p-b-26"><a href="/"> <img  src={require('../img/logo2.png')} width="95px" height="95px" /></a></span>
                </div>

                <div className="d-flex justify-content-center"> <h4 className="modal-title">Login to Your Account</h4></div>
                {(errors!==null)?<p className="text-center text-danger small" >{errors}</p>:null}
                <div className="form-group">
                    <input type="text"  className={`form-control ${error.userName && 'is-invalid'}`}  placeholder="Email"
                           name="userName" value={formField.userName} onChange={handleOnChange}/>
                    {error.userName &&(<div className="invalid-feedback">{error.userName}</div>)}
                </div>
                <div className="form-group">
                    <input type="password" name="password" className={`form-control ${error.password && 'is-invalid'}`} placeholder="Password"
                           required="required" value={formField.password} onChange={handleOnChange}/>
                    {error.password &&(<div className="invalid-feedback">{error.password}</div>)}
                </div>
                <div className="form-group small clearfix">
                    <label className="checkbox-inline"><input type="checkbox"/> Remember me</label>
                    <Link to="#" className="forgot-link">Forgot Password?</Link>
                </div>
                <button type="button" onClick={(event)=>{setIsLoading(true);handleSubmit(event)}} className="btn btn-primary btn-block btn-lg" >Login</button>
            </form>
            <div className="text-center small">Don't have an account? <a href="/SignUp" >Sign up</a></div>
            </div>}
        </div>
    );
}
export default LoginPage;
