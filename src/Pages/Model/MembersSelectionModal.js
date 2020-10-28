import React, {useContext, useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {memberSettlementContext, userDetailsContext} from "../service/Contexts";
import {useMembersCheckbox} from "../service/useMembersCheckbox";
import {GreenCheckbox} from "../service/CustomTooltip";
import {useForm} from "../service/useForm";



export function MembersSelectionModal (props){
    const memberSettlement = useContext(memberSettlementContext);
    const userContext = useContext(userDetailsContext);
    const [members,setGroupMembers]=useState([]);
    const formEntryInitial = {
        date:new Date().getFullYear() + "-" + ("0" + (new Date().getMonth()+1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),paidBy:""
    };
    useEffect(()=>{
        if ( typeof userContext.userData.userDetails.fullName !=="undefined" )
        {
            if(sessionStorage.getItem("groupName") !== null ) {
                memberSettlement.fetchData.then(e => {
                    // console.log("E", e);
                    setGroupMembers(e.groupMemberList);
                });
            }
        }
    },[userContext.userData,sessionStorage.getItem("groupName")]);

    const submit =()=>{};
    const ValidateBillEntryForm = ()=>{}

    const { checkBoxes,checkedMemberList,handleCheckBox,isCheckAll,groupMembers} = useMembersCheckbox(members);
    const {handleSubmit, handleOnChange, error, formField} = useForm(submit,formEntryInitial,ValidateBillEntryForm);
    console.log("se",checkedMemberList)
    return (
        <Modal show={props.show}  onHide={props.hide} centered  aria-labelledby="contained-modal-title-vcenter"   dialogClassName="cus-modal-dialog">
            <Modal.Header closeButton >
                <Modal.Title className="txt-color ">  Split On </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="row">
                        <label className="col-md-3">Bill Date :</label>
                        <div className="col-md-8">
                            <input type="date"
                                   name="date"
                                   onChange={handleOnChange}
                                   value={formField.date}
                                   className={`form-control  ${error.date && 'is-invalid'}`}
                                   placeholder="Enter Date"/>
                            {error.date &&(<div className="invalid-feedback">{error.date}</div>)}
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-md-3">Paid By : </label>
                       <div className="col-md-8 mb-3">
                           <select
                               className={`form-control ${error.paidBy && 'is-invalid'}`}
                               name="paidBy"  value={formField.paidBy}
                               onChange={handleOnChange}>
                               <option value="" >Select ....</option>
                               {
                                   groupMembers.map((member,index)=>{
                                       return (<option value={member.name} key={index}>{member.name}</option>);
                                   })
                               }
                           </select>
                           {error.paidBy &&(<div className="invalid-feedback">{error.paidBy}</div>)}
                       </div>
                    </div>

                <ul className="cust-chcekbox">
                    <li ><GreenCheckbox onChange={(event)=>handleCheckBox(event,-1)} checked={isCheckAll} /><label className="col-form-label cust-checkbox-label">All</label></li>
                    {checkBoxes}
                </ul>
            </Modal.Body>
            <Modal.Footer>
               <button className="btn btn-success"  >
                    Add
                </button>
                <button className="btn btn-secondary" onClick={props.hide}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>

    )
}
export default MembersSelectionModal;

