import React, { useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Icon } from 'react-icons-kit';
import {plus,minus}  from 'react-icons-kit/fa/';
import {RequestHandler} from "../service/RequestHandler";
import {useForm} from "../service/useForm";
import {validateCreateGroup} from "../service/ValidateForm";

export function ModalsForm (props){
    const [addedFields,setaddedFields] = useState([]);
    const [show,setShow] = useState(false);
    const [successMessage,setSuccesMessage]=useState({status:false,message:""});
    const [checkClosing,setClosing] = useState(props.toBeClosed);
    const [systemGroups, setSystemGroups ] = useState([]);
    const [isAvailable, setAvailability] = useState({});
    const submit=(value)=>{

        let addedFeildObj = addedFields.reduce((accumulator,currentValue,index)=>{
            accumulator["name"+(index+1)] = currentValue;
            return accumulator;
        },{});

        let formData = {
            ...formField,
            ...addedFeildObj,
            "profileName":props.userName,
        };

        console.log("formDatra",formData);
        RequestHandler('/createGroup',formData,'post',props.jwt).then(result=>{
            console.log("here is the result",result);
            if (result)
            {
                setSuccesMessage({status: true,message:"Successfully created Group"});
                setClosing(true);
                window.location.reload();

            }
            else
            {
                setSuccesMessage({...successMessage,message: "Failed to create group. Please check your details and try resubmitting it"})
            }
        });
        setaddedFields([]);
    }

    const handleAddField=()=>{
        setaddedFields([ ...addedFields,""])
    }
    const handleChange= (event,index)=>{
       setaddedFields(addedFields.map((value,i)=>{
          return  i ===index ?event.target.value:value
        }))
    }
    const removeField=(index)=>{
        setaddedFields(addedFields.filter((phoneField,i)=>{return (i !== index)}))
    };

    const findAvailableGroup=(event)=>{

        const matchedName = systemGroups.filter((name)=>{
            if (name.toLowerCase().trim() === event.target.value.toLowerCase().trim()){
                return name;
            }
        });

        if (event.target.value !== "")
        {
            if (matchedName.length !== 0)
            {
                setAvailability({status:"no"});

            }
            else{
                setAvailability({status:"yes"});
            }
        }
        else{
            setAvailability("");
        }
    };

    const {error,formField,handleOnChange,changeValue,handleSubmit} = useForm(submit,{"gName":"","name0":""},validateCreateGroup);
    useEffect(()=>{
        setShow(props.show);
        if (systemGroups.length ===0)
        {
            RequestHandler("allGroups","","get",props.jwt).then(result=>{
                setSystemGroups(result);
                })
        }
    },[props]);

    return (
        <Modal show={show} centered onHide={checkClosing?props.hide:()=>{}}  >
            <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title className="txt-color "> Create Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successMessage.status ? <div className="text-success">{successMessage.message}</div>:(<div className="alert-danger">{error.message}</div>)}
                <div className="md-form mb-4 row">
                    <label className="col-form-label col-sm-3 " htmlFor="gName">Group Name:</label>
                    <div className="col-sm-8 ">
                        <input type="text" name="gName" id="gName" onChange={(event =>{handleOnChange(event); findAvailableGroup(event)})} value={formField.gName} className={`form-control ${error.gName && 'is-invalid'}`}
                               placeholder="Group name should be unique..."/>
                        {error.gName &&(<div className="invalid-feedback">{error.gName}</div>)}
                        {isAvailable.status&&(isAvailable.status === "yes"?<p className="text-success small">Group name is available.</p>:<p className="text-danger small">Group name is not available.</p>)}
                    </div>

                </div>
                <div className="md-form mb-7">
                    <div className="table-responsive">
                        <table className="table " id="dynamic_field">
                            <tbody>
                            <tr>
                                <td><input type="text" name="name0" placeholder="Member's Phone Number"
                                           className={`form-control  ${error.name0 && 'is-invalid'}`} value={formField.name0} onChange={handleOnChange}/>
                                    {error.name0 &&(<div className="invalid-feedback">{error.name0}</div>)}
                                </td>
                                <td>
                                    <button type="button"  className="btn btn-success d-block" onClick={handleAddField}> <Icon icon={plus}></Icon>
                                    </button>
                                </td>
                            </tr>
                            {
                                addedFields.map((phoneField,index)=>{
                                    return(
                                        <tr key={index}>
                                            <td><input type="text" required={true} value={phoneField} onChange={(event)=>{handleChange(event,index)}} placeholder="Member's Phone Number"
                                                       className="form-control name_list"/></td>
                                            <td>
                                                <button type="button"  className="btn btn-danger d-block" onClick={()=>removeField(index)}> <Icon icon={minus}></Icon>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>

                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" type="button" onClick={checkClosing?props.hide:null}>
                    Close
                </button>
                <button className="btn btn-success" disabled={isAvailable.status==="no"&& true} type="submit" >
                    Save
                </button>
            </Modal.Footer>
            </form>
        </Modal>
    )
}
export default ModalsForm;

