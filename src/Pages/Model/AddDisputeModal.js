import React, { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/CutsomCss.css'
import {RequestHandler} from "../service/RequestHandler";
import {useForm} from "../service/useForm";


export function DisputeModal (props){
    const [successMessage,setSuccesMessage]=useState({"status":false,"message":""});


    const submit=(value)=>{
        let formEntry = {...formField,billingDetails:props.bill,isValid: 0, raisedUserName:props.userID,};
        console.log("f",formEntry);
        RequestHandler('/addDispute',formEntry,'post',props.jwt).then(result=>{
            if(result.status === 200)
            {
                setSuccesMessage({status:true,message:"Successfully Added"});
                setTimeout(()=>{
                    props.hide()
                },1200)
            }
            else
            {
                setSuccesMessage({"status":false,"message":"Error! Please Try Again"});
            }
        });
    };

    const click = ()=>{
        RequestHandler('/getDispute',"0",'get',props.jwt).then((e)=>{
            console.log("e",e);
        });
    }
    const validateDisputeForm = formData =>{
        let error = {}
        if(formData.title === "")
        {
            error.title = "Please enter member's name";
        }
        if (formData.description === "")
        {
            error.description = "Please enter phone number";
        }
        else if(countWords(formData.description) >250 )
        {
            error.description = "Your description cannot be more than 250 words";
        }
        return error;
    };

    const  countWords=(str)=> {
        str = str.replace(/(^\s*)|(\s*$)/gi,"");
        str = str.replace(/[ ]{2,}/gi," ");
        str = str.replace(/\n /,"\n");
        return str.split(' ').length;}

    const {error,handleOnChange,handleSubmit,changeValue,formField}= useForm(submit,{"title":"","description":""},validateDisputeForm)
    return (
        <Modal show={props.show} centered onHide={props.hide} >
            <Modal.Header closeButton >
                <Modal.Title className="txt-color "> Dispute Form </Modal.Title>
            </Modal.Header>
            {!successMessage.status?
                <Modal.Body>
                    {!successMessage.status && successMessage.message!==""? <div className="alert-danger">{successMessage.message}</div>:null}
                    <div className="md-form mb-4">
                        <input type="text" name="name"  value={"Selected bill's Description: "+props.bill.description} className={`form-control` } placeholder=" Title" readOnly/>
                    </div>
                    <div className="md-form mb-4">
                        <input type="text" name="title" onChange={handleOnChange} value={formField.title} className={`form-control ${error.title && 'is-invalid'}`}
                               placeholder=" Title"/>
                        {error.title &&(<div className="invalid-feedback">{error.title}</div>)}
                    </div>
                    <div className="md-form mb-7">
                        <textarea rows="4" cols="50"  name="description" onChange={handleOnChange} value={formField.description} className={`form-control ${error.description && 'is-invalid'}`}
                               placeholder="Description"/>
                        {error.description &&(<div className="invalid-feedback">{error.description}</div>)}
                    </div>

                </Modal.Body>
                :<Modal.Body>
                    <h4>{successMessage.message}</h4>
                </Modal.Body>}
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.hide}>
                    Close
                </button>
                {!successMessage.status? <button className="btn btn-success" onClick={handleSubmit}>
                    Save
                </button>:null}
                <button className="btn btn-secondary" onClick={click}>
                    check
                </button>
            </Modal.Footer>
        </Modal>
    )
}
export default DisputeModal;

