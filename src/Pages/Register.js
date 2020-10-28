import React from 'react';
import {Icon} from 'react-icons-kit';
import {user} from 'react-icons-kit/fa/';
import {FetchingLoginInfo} from "./service/Login&ResgisterHandler";
import {useForm} from "./service/useForm";
import {validateRegisterForm} from "./service/ValidateForm";

const Register =()=>{
    let formData = {
        "fullName":'',
        "phoneNumber":"",
        "userName":"",
        "password":"",
        "confirmPassword":""
    };

    const [status,setStatus]=React.useState("");
    const submit=(value) =>{
        delete formField['confirmPassword'];
        console.log("formData",formData)
        FetchingLoginInfo('/registerUser',formField,'post').then(result=>{
            console.log("resilt",result)
            if (result ===true)
            {
                setStatus({success:"Successfully Registered"});
            }
            else if (result.status === 400)
            {
                setStatus({error:result.errors})
            }
            else {
                setStatus({error:"Error while registering user.."});
            }
        });


    };
    const {formField,error,changeFormField,handleSubmit,handleOnChange} = useForm(submit, formData,validateRegisterForm);
    return(
                <div className="login-form">
                    <div className="form-container ">
                    <form onSubmit={handleSubmit}>
                        <div className="register-header">
                            <span className="login100-form-title p-b-26">Welcome</span>
                            <span className="login100-form-title p-b-26"> <a href="/"> <img  src={require('../img/logo2.png')} width="95px" height="95px" /></a></span>
                        </div>
                        {status.success && <h4 className="text-success d-flex justify-content-center">{status.success}</h4>}
                        {status.error && <h4 className="text-danger  d-flex justify-content-center">{status.error}</h4>}
                        <div className="d-flex justify-content-center "><h4 className="modal-title">Register Your Details</h4></div>
                        <div className="form-group">
                            <input type="text" name="fullName"   className={`form-control ${error.fullName && 'is-invalid'}`} value={formField.fullName} onChange={handleOnChange} placeholder="Full Name"/>
                            {error.fullName &&(<div className="invalid-feedback">{error.fullName}</div>)}
                        </div>
                        <div className="form-group">
                            <input  type="text" name="phoneNumber" className={`form-control ${error.phoneNumber && 'is-invalid'}`} value={formField.phoneNumber}  onChange={handleOnChange} placeholder="Phone Number"/>
                            {error.phoneNumber &&(<div className="invalid-feedback">{error.phoneNumber}</div>)}
                        </div>
                        <div className="form-group">
                            <input  type="text" name="userName" className={`form-control ${error.userName && 'is-invalid'}`} value={formField.userName}  onChange={handleOnChange} placeholder="Username"/>
                            {error.userName &&(<div className="invalid-feedback">{error.userName}</div>)}
                        </div>
                        <div className="form-group">
                            <input  type="password" name="password" className={`form-control ${error.password && 'is-invalid'}`} value={formField.password}  onChange={handleOnChange} placeholder="Password"/>
                            {error.password &&(<div className="invalid-feedback">{error.password}</div>)}
                        </div>
                        <div className="form-group">
                            <input type="password" name="confirmPassword" className={`form-control ${error.confirmPassword && 'is-invalid'}`} value={formField.confirmPassword} onChange={handleOnChange} placeholder="Confirm Password"/>
                            {error.confirmPassword && <div className="invalid-feedback">{error.confirmPassword}</div>}
                        </div>

                        <input type="submit"  className="btn btn-primary btn-block btn-lg" value="Sign up"/>

                    </form>
                        <div className="text-center small">Do have an account? <a href="/Login">Login </a></div>
                    </div>
                </div>);


    };
export default Register;
