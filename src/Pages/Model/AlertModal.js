import React from 'react';
import Modal from 'react-bootstrap/Modal';


export function AlertModal (props){

    const handleOkay = ()=>{
        props.callBack();
        props.hide()
    };
    const errorAlert = props.message.substring(0,5);

    return (
        <Modal show={props.show}  onHide={props.hide} centered  aria-labelledby="contained-modal-title-vcenter"   dialogClassName="cus-modal-dialog">
        <Modal.Header closeButton >
            <Modal.Title className="txt-color ">  Alert </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className={`alertMessage ${errorAlert ==="Error"?"text-danger":""}`}> {props.message}</p>
        </Modal.Body>
        <Modal.Footer>
            {errorAlert!=="Error"&&<button className="btn btn-success" onClick={handleOkay} >
               Yes
            </button>}
            <button className="btn btn-secondary" onClick={props.hide}>
                No
            </button>
        </Modal.Footer>
    </Modal>

    )
}
export default AlertModal;

