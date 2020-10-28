import React, {useContext, useEffect, useState} from 'react';
import {Modal,Spinner} from 'react-bootstrap';
import { Icon } from 'react-icons-kit';
import {download,close,send} from 'react-icons-kit/fa/'
import {RequestHandler} from "../service/RequestHandler";


const FinalSettlement =(props)=> {

    const [message,setMessage]=useState({});
    const [isLoading,setLoading]=useState(false);


    const getEmailAddresses = ()=>{
        let email=[];
        let user=[];
      props.members.map(member=>{

            if (member.userName !== null)
            {
                email.push(member.userName);
            }
            else
            {
                user.push(member.fullName);
            }
            return email;
        });
        console.log("email",email);
        return {email,user};
    };

    const handleDownload = () => {
        const data = {"billingDetails": props.billingDetails, "settlementList": props.data};
        const token = "Bearer "+props.jwt;
        const header = new Headers({'Content-Type':'application/json','Authorization':token});
         fetch('/download',{
             method: 'post',
             body: JSON.stringify(data),
             headers: header})
            .then(response => {
                const filename = response.headers.get('Content-Disposition').split('filename=')[1];
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                });
            });
    };

   const handleEmail = ()=>{
       setLoading(true);
       const{email,user}=getEmailAddresses();
       const data = {"senders":email ,"billingDetails": props.billingDetails, "settlementList": props.data};
         RequestHandler("/sendEmail",data,"post",props.jwt).then(result=>{
             console.log("res",result)
             if (result.ok && user.length ===0)
             {
                 setMessage({success:"Email was successfully sent"})
                 setLoading(false);
             }
             else if (result.ok && user.length !==0)
             {
                 setMessage({success:"Email was successfully sent" ,emailNotSend:[...user]+" didn't have the email address in the system. No email has sent to them..."});
                 setLoading(false);

             }
             else if (!result.ok)
             {
                 setMessage({emailNotSend:"Email not sent. Something went wrong. Please try resending again.."});
                 setLoading(false);
             }
         });

   };

    return (
        <Modal show={props.show}  centered  onHide={props.hide} >
            <Modal.Header closeButton>
                <Modal.Title className="txt-color ">Final Settlement</Modal.Title>
            </Modal.Header>
            {!isLoading?<Modal.Body>
                {message.emailNotSend&&<p className="text-danger"> {message.emailNotSend}</p>}
                {message.success&&<p className="text-success"> {message.success}</p>}
               { typeof props.data !=='string'?
                   <div>
                       <h4>Suggested Payments</h4>
                        <ul>
                        {Object.entries(props.data).map((value) => {
                            let key = 0;
                           const result = value[key+1].map((v,k )=>{return(<li key={k}>{v.name} pays {value[key]} = {v.amount.toFixed(2)}</li>)});
                           return result;
                        })}

                        </ul>
                       <h4>Total Money Spent</h4>
                       <ul>
                       {
                           props.totalSpending.map((value,key)=>{
                              return (
                                  <li key={key}>{value.name} = {value.amount.toFixed(2)}</li>
                              )
                           })
                       }
                       </ul>
                       {console.log("spending ",props.totalSpending)}
                    </div>
                   :
                   <h4 style={{color:"red"}}>{props.data}</h4>
               }
            </Modal.Body>:
           <Modal.Body>
               <div className="d-flex justify-content-center align-content-center">
               <Spinner  animation="border" role="status" variant="success">
                   <span className="sr-only">Loading...</span>
               </Spinner>
               </div>
           </Modal.Body>
            }
            <Modal.Footer>
                { typeof props.data !=='string'? <button className="btn btn-success" onClick={handleDownload}>
                    <Icon icon={download}></Icon> Download
                </button>:null}
                { typeof props.data !=='string'? <button className="btn btn-success" onClick={handleEmail}>
                    <Icon icon={send}></Icon> Send Email
                </button>:null}
                <button className="btn btn-secondary" onClick={props.hide}>
                    <Icon icon={close}></Icon> Close
                </button>
            </Modal.Footer>
        </Modal>
    );
}
export default FinalSettlement;
