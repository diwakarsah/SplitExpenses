import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';

import {ValidateBillEntryForm} from '../service/ValidateForm';
import { Icon } from 'react-icons-kit';
import {plus,close} from 'react-icons-kit/fa/';
import {RequestHandler} from "../service/RequestHandler";
import {GreenCheckbox} from "../service/CustomTooltip";
import {useForm} from "../service/useForm";


export function BillEntryForm (props){
    let formEntryInitial= {"description":"",
            "date":new Date().getFullYear() + "-" + ("0" + (new Date().getMonth()+1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
            "amount":"",
            "paidBy":"",
            };
    const [groupMembers,setGroupMembers] = useState([]);
    const [checkedMemberList,setCheckedMemberList] =useState([]);
    const [show,setShow] = useState(false);
    const [checkSuccess,setCheckSuccess] = useState("");
    const [modalTitle,setModalTitle]= useState("Add Bill Details");
    const [isCheckAll,setIsCheckAll]=useState(false);
    const [errors,setErrors] =useState({});

    const submit=(submitType)=>{
       if (checkedMemberList.length !== 0) {
           if (submitType === "Add" || typeof submitType === "undefined") {
               let constructSendData = {
                   ...formField,
                   "groupName": sessionStorage.getItem('groupName'),
                   "splitedOn": checkedMemberList.toString(),
                   "enteredId": props.user.id
               };


               RequestHandler('/addBillDetails',constructSendData,'post',props.jwt).then(returnResult=>{
                   console.log("BillResult",returnResult.status);
                   typeof returnResult.ok === "undefined" ? setCheckSuccess(true):setCheckSuccess(false);
               });
               props.addBilling();
               setCheckedMemberList([]);
               setGroupMembers(groupMembers.map((member) => ({...member, isChecked: false})));
               setIsCheckAll(false);
               setErrors(false);

           } else if (submitType === "Update") {
               let constructSendData = {
                   "transId": props.selectedBill.transId,
                   "spittedAmount": props.selectedBill.spittedAmount.toString(),
                   ...formField,
                   "groupName": sessionStorage.getItem('groupName'),
                   "splitedOn": checkedMemberList.toString(),
                   "flag": props.selectedBill.flag,
                   "enteredId": props.user.id
               };
               console.log("csd",constructSendData)
               RequestHandler('/updateBillDetails', constructSendData, 'put', props.jwt).then(returnResult => {
                   console.log("BillResult", returnResult.status);
                   if(typeof returnResult.ok === "undefined")
                   {setCheckSuccess(true);
                   setErrors(false);
                   }
                   else{
                       setCheckSuccess(false)};

               });
               props.addBilling();
               setCheckedMemberList([]);
               setGroupMembers(groupMembers.map((member) => ({...member, isChecked: false})));
               setIsCheckAll(false);
               setErrors(false);

           }
           setCheckedMemberList([]);
           setInterval(()=>{
               setCheckSuccess("")
           },2000);
       }
       else {
           setErrors({"checkBoxes":"Please tick at least one of the check box"});
       }
    };



    const handleEditValueSet = (members)=> {
        let updatedFeildValue ={
            "description":props.selectedBill.description,
            "date":new Date(props.selectedBill.date).getFullYear() + "-" + ("0" + (new Date(props.selectedBill.date).getMonth()+1)).slice(-2) + "-" + ("0" + new Date(props.selectedBill.date).getDate()).slice(-2),
            "amount":props.selectedBill.amount,
            "paidBy":props.selectedBill.paidBy,
        };
         setModalTitle("Edit Details");
        changeFormField(updatedFeildValue);
        let membersArray = props.selectedBill.splitedOn.split(",");
        setCheckedMemberList(membersArray);
        setGroupMembers(members.map((member)=>(membersArray.indexOf(member.name) !== -1? {...member,isChecked:true}:member)));
       if (props.groupMembers.length === membersArray.length)
       {
           setIsCheckAll(true);
       }
    };


    const handleCheckBox=(event,index)=>{
        if(index === -1)
        {
            if(event.target.checked) {
                setIsCheckAll(true);
                setCheckedMemberList(groupMembers.map((member) => (member.name)));
                setGroupMembers(groupMembers.map((member) => ({...member, isChecked: true})));
            }
            else
            {
                setIsCheckAll(false);
                setCheckedMemberList([]);
                setGroupMembers(groupMembers.map((member) => ({...member, isChecked: false})));
            }
        }
        else
        {
            if (event.target.checked)
            {
               setCheckedMemberList([...checkedMemberList,groupMembers[index].name]);
               setGroupMembers(groupMembers.map((member,i)=>(index===i?{...member,isChecked:true}:member)));
            }
            else
            {
                setCheckedMemberList(checkedMemberList.filter((member)=>{return (member!==event.target.value)}));
                setGroupMembers(groupMembers.map((member,i)=>(index===i?{...member,isChecked:false}:member)));
            }

        }

    };

    const {handleSubmit, handleOnChange,changeFormField, error, formField} = useForm(submit,formEntryInitial,ValidateBillEntryForm);

    useEffect(()=>{
        setShow(props.show);
        const readyGroupMembers = props.groupMembers.map(member=>{
            console.log("memeber",member);
           let index = member.indexOf("(")===-1 ?member.indexOf(' '):-1;
            let firstName = index!== -1 ? (member.substring(0,index)+"_"+member.substring(index+1,index+4)):member;

            let temp = {
                "name": firstName,
                "isChecked": false
            };
            return temp;
        });
        setGroupMembers(readyGroupMembers);
        if (props.selectedBill !== null)
        {
            handleEditValueSet(readyGroupMembers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.groupMembers,props.show]);


    return (
        <Modal show={show} centered onHide={props.hide}  >
            <Modal.Header closeButton >
                <Modal.Title className=" txt-color"> {modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form >
                    <div className="from-group ">
                            <input type="text"
                                   name="description"
                                   onChange={handleOnChange}
                                   value={formField.description}
                                   className={`form-control ${error.description && 'is-invalid'}`}
                                   placeholder="Description"/>
                        {error.description &&(<div className="invalid-feedback">{error.description}</div>)}
                    </div>
                    <div className="from-group row">
                        <div className="col">
                        <input type="date"
                               name="date"
                               onChange={handleOnChange}
                               value={formField.date}
                               className={`form-control ${error.date && 'is-invalid'}`}
                               placeholder="Enter Date"/>
                            {error.date &&(<div className="invalid-feedback">{error.date}</div>)}
                        </div>
                        <div className="col">
                            <input
                                type="number"
                                name="amount"
                                onChange={handleOnChange}
                                value={formField.amount}
                                className={`form-control ${error.amount && 'is-invalid'}`}
                                   placeholder="Amount"/>
                            {error.amount &&(<div className="invalid-feedback">{error.amount}</div>)}
                        </div>
                    </div>
                    <div className="from-group">
                            <select
                                className={`form-control ${error.paidBy && 'is-invalid'}`}
                                name="paidBy"  value={formField.paidBy}
                                onChange={handleOnChange}>
                                <option value="" >Paid By....</option>
                                {
                                    groupMembers.map((member,index)=>{
                                        return (<option value={member.name} key={index}>{member.name}</option>);
                                    })
                                }
                            </select>
                        {error.paidBy &&(<div className="invalid-feedback">{error.paidBy}</div>)}
                    </div>

                    <div className={`from-group ${errors.checkBoxes && 'is-invalid'}`}>
                        <label className="col-form-label-sm">Split On:</label>
                        <ul className="cust-chcekbox">
                            <li ><GreenCheckbox onChange={(event)=>handleCheckBox(event,-1)} checked={isCheckAll} /><label className="col-form-label cust-checkbox-label">All</label></li>
                        {groupMembers.map((member,index)=>{
                           return (
                               <li   key={index}>
                                    <GreenCheckbox  checked={member.isChecked}  className="custom-checkbox" value={member.name} onChange={(event)=>handleCheckBox(event,index)}/>
                                   <label  ><span className="text-uppercase cust-checkbox-label">{member.name.substring(0,1)}</span><span style={{fontSize:"12px"}}>{member.name.substring(1,member.size)}</span></label>
                               </li>
                           );
                        })}

                        </ul>
                    </div>
                    {errors.checkBoxes &&(<div className="invalid-feedback">{errors.checkBoxes}</div>)}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div style={{marginRight: "auto"}}>  {(checkSuccess === true) ? <h5 style={{color:"green"}}>Successfully Added </h5>: (checkSuccess === false)?<h5 style={{color:"red"}}> Error!!Please enter again</h5>:null}</div>
                <button className="btn btn-secondary" onClick={props.hide}>
                    <Icon icon={close}></Icon>  Close
                </button>
                {props.selectedBill === null?
                <button  type="button" className="btn btn-success" value="Add" onClick={handleSubmit}><Icon  icon={plus}></Icon> Add</button>:
                <button  type="button" className="btn btn-success" value="Update" onClick={handleSubmit}>
                    <Icon   icon={plus}></Icon> Update
                </button>}

            </Modal.Footer>
        </Modal>
    )
}
export default BillEntryForm;
