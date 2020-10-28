import React, { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Icon } from 'react-icons-kit';
import {plus}  from 'react-icons-kit/fa/';
import {RequestHandler} from "../service/RequestHandler";
import {useForm} from "../service/useForm";
import {validateAddEdMember} from "../service/ValidateForm";


export function AddMemberToGroup (props){
    const [successMessage,setSuccesMessage]=useState({"status":false,"message":""});


    const submit=(value)=>{
            let formEntry = {...formField,"groupName":sessionStorage.getItem("groupName")};
            RequestHandler('addMember',formEntry,'post',props.jwt).then(result=>{
               if(result)
               {
                   setSuccesMessage({status:true,message:"Successfully Added"});
                   setTimeout(()=>{
                       props.hide()
                   },1000);
                   props.callBack();
               }
               else
               {
                   setSuccesMessage({"status":false,"message":"Error! Please Try Again"});
               }
                });
    };

    const {error,handleOnChange,handleSubmit,changeValue,formField}= useForm(submit,{"name":"","number":""},validateAddEdMember)
    return (
        <Modal show={props.show} centered onHide={props.hide}  >
            <Modal.Header closeButton >
                <Modal.Title className="txt-color "> Add Member </Modal.Title>
            </Modal.Header>
            {!successMessage.status?
                <Modal.Body>
                   {!successMessage.status && successMessage.message!==""? <div className="alert-danger">{successMessage.message}</div>:null}
                    <div className="md-form mb-4 row">
                        <label className="col-form-label col-sm-4 label-margin" htmlFor="name">Member Name:</label>
                        <div className="col-sm-8 ">
                            <input type="text" id="name" name="name" onChange={handleOnChange} value={formField.name} className={`form-control ${error.name && 'is-invalid'}`}
                                   placeholder="Enter Member Name"/>
                            {error.name &&(<div className="invalid-feedback">{error.name}</div>)}
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-form-label col-sm-4 label-margin" htmlFor="number">Phone number:</label>
                       <div className="col-sm-8">
                           <input type="text" id="number" name="number" onChange={handleOnChange} value={formField.number} className={`form-control ${error.number && 'is-invalid'}`}
                                  placeholder="Enter Phone Number"/>
                           {error.number &&(<div className="invalid-feedback">{error.number}</div>)}
                       </div>
                    </div>

                </Modal.Body>
                :<Modal.Body>
                    <h4 className="text-success">{successMessage.message}</h4>
                </Modal.Body>}
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.hide}>
                    Close
                </button>
                {!successMessage.status? <button className="btn btn-success" onClick={handleSubmit}>
                    <Icon icon={plus}></Icon> Add
                </button>:null}
            </Modal.Footer>
        </Modal>
    )
}
export default AddMemberToGroup;

