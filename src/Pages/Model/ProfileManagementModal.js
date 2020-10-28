import React, {useContext,useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {userDetailsContext} from "../service/Contexts";
import {useWindowSize} from "../service/useWindowSize";
import {useForm} from "../service/useForm";
import {RequestHandler} from "../service/RequestHandler";


export function ProfileManagementModal (props){
    const userContext = useContext(userDetailsContext);
    const selectedUser = typeof userContext.userData.userDetails !=='undefined'&&userContext.userData.userDetails;
    const [message,setMessage]=useState({});
    const windowSize = useWindowSize();
    console.log("user",selectedUser);
    let formData = {
        "phoneNumber":"",
        "userName":"",
        "password":"",
        "confirmPassword":"",
        "oldPassword":""
    };

    const validateFormData =()=>{
        let error={};

         if (formField.phoneNumber.length>15)
         {
            error.phoneNumber = "Please Enter valid phone number";
         }
        if (formField.userName !=="" && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formField.userName))
        {
            error.userName = "Please use valid email address "
        }
        if (formField.password !==""&& formField.password.length <=6)
        {

            error.password = "Please choose more than 6 characters password"
        }
        if (formField.password !== formField.confirmPassword)
        {
            error.password="Password didn't match..."
        }
        if (formField.oldPassword ==="")
        {
            error.oldPassword="Please enter the old password"
        }
        return error;

    };
    const submit=(value) => {
        delete formField['confirmPassword'];
        const sendingData = {...formField, oldUsername: selectedUser.userName};
        RequestHandler("/updateProfileDetails", sendingData, 'post', props.jwt).then(result => {
            if(typeof result.ok !="undefined" &&!result.ok)
            {
                if (result.status === 404) {
                    setMessage({error: "Error Password is incorrect!!"});
                } else {
                    setMessage({error: "Error "+result.statusText});
                }
            }
            else {
                setMessage({success: "Successfully Updated.."});
            }
        });
    };

    const {formField,error,changeFormField,handleSubmit,handleOnChange} = useForm(submit, formData,validateFormData);
    return (
        <Modal show={props.show}  onHide={props.hide} size="lg" centered >
            <Modal.Header closeButton>
                <Modal.Title className="txt-color "> Edit Profile </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form-group container">
                    {message.success&&<p className="text-success">{message.success}</p>}
                    {message.error&&<p className="text-danger">{message.error}</p>}
                    <label className="col-form-label-lg">Phone Number:</label>
                    <div className="row  justify-content-center">
                        <input type="text" className={`form-control col-md-5  ${error.phoneNumber && 'is-invalid'}`} name="phoneNumber" placeholder="New Phone Number" value={formField.phoneNumber} onChange={handleOnChange}/>
                        <input type="text" className={`${windowSize.width >768&& 'txtField-editingPage'} form-control col-md-5 `}   readOnly value={selectedUser.phoneNumber}/>
                    </div>
                    {error.phoneNumber &&(<div className="error-container d-flex justify-content-center">{error.phoneNumber}</div>)}

                    <label className="col-form-label-lg">Email:</label>
                    <div className="row  justify-content-center">
                        <input type="email" className={`form-control col-md-5  ${error.userName && 'is-invalid'}`} name="userName" placeholder="New Email" value={formField.userName} onChange={ handleOnChange}/>
                        <input type="text" className={`${windowSize.width >768&& 'txtField-editingPage'} form-control col-md-5 `}   readOnly value={selectedUser.userName}/>
                    </div>
                    {error.userName &&(<div className="error-container d-flex justify-content-center">{error.userName}</div>)}

                    <label className="col-form-label-lg">Password:</label>
                    <div className="row  justify-content-center">
                        <input type="password" className={`form-control col-md-5  ${error.password && 'is-invalid'}`} name="password" placeholder="New Password" value={formField.password} onChange={ handleOnChange}/>
                        <input type="password" className={`${windowSize.width >768&& 'txtField-editingPage'} form-control col-md-5  `} name="confirmPassword" placeholder="Confirm Password" value={formField.confirmPassword} onChange={(event => handleOnChange(event))}/>
                    </div>
                    {error.password &&(<div className="error-container d-flex justify-content-center">{error.password}</div>)}

                    <div className="d-flex justify-content-center">
                    <input type="password" className={`form-control col-md-5  ${error.oldPassword && 'is-invalid'}`} placeholder="Old Password" name="oldPassword" value={formField.oldPassword} onChange={handleOnChange}/>
                    </div>
                    {error.oldPassword &&<div className="error-container d-flex justify-content-center">{error.oldPassword}</div>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-success" onClick={handleSubmit}>
                    Update
                </button>
                <button className="btn btn-secondary" onClick={props.hide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}
export default ProfileManagementModal;

