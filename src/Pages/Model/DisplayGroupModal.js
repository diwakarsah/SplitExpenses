import React, { useState,useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import { Icon } from 'react-icons-kit';
import {group} from 'react-icons-kit/fa/'
import {memberSettlementContext} from "../service/Contexts";

const DisplayGroupModal =(props)=>{
    const memberSettlement = useContext(memberSettlementContext);
    let sessionResult =sessionStorage.getItem("isShown") === null?true: false ;
    const [show,setShow] = useState(sessionResult);
    const handleSelected = (selectedGroup)=>{
        sessionStorage.setItem("groupName",selectedGroup.groupName);
        sessionStorage.setItem("createdBy",selectedGroup.createdBy);
        sessionStorage.setItem("isShown",false);
        sessionResult = !((sessionStorage.getItem("isShown"))==="false");
        setShow(sessionResult);
    };


    return (
        <Modal show={show} centered onHide={()=>{return true}}  onExiting={props.callBack} >
            <Modal.Header className="justify-content-center" >
                <Modal.Title className="txt-color ">Select a Group</Modal.Title>
            </Modal.Header>
            <Modal.Body className="cus-modal-body">
                <ul > {
                    props.props.map((groups,index)=>{
                       return(
                               <li key={index}> <a className="text-uppercase" key={index} onClick={(event)=>{handleSelected(groups)}} href="#" ><Icon icon={group}></Icon> {groups.groupName}</a></li>
                        );
                    })
                }</ul>

            </Modal.Body>
        </Modal>
    );
}
export default DisplayGroupModal;
