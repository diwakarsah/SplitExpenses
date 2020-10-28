import React, {useContext, useState} from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import {userDetailsContext} from "./service/Contexts";
import {LightTooltip} from "./service/CustomTooltip";
import {RequestHandler} from "./service/RequestHandler";
import AlertModal from "./Model/AlertModal";
import {useWindowSize} from "./service/useWindowSize";
import {Icon} from "react-icons-kit";
import {ic_arrow_drop_down} from 'react-icons-kit/md/ic_arrow_drop_down';


const DisputePage = (props)=>{
    const userContext = useContext(userDetailsContext);
    const [alert,setAlert] = useState({displayAlert:false,message:""});
    const [selectedDispute,setSelectedDispute] = useState(null);
    const fullName = typeof userContext.userData.userDetails !=='undefined'&&userContext.userData.userDetails.fullName;
    const windowSize = useWindowSize();

    const handleSubmit=(dispute)=>{
        setSelectedDispute(fullName !== dispute.raisedUserName ?{...dispute,isValid:1}:{...dispute,isValid:2})
        setAlert({displayAlert:true,message: "Have you solved the dispute with this bill?"})
    };
    const submit=()=>{
        console.log("dispute",selectedDispute);
        // RequestHandler("/updateDispute",dispute,'put',props.jwt).then((result)=>{
        //     console.log("Ads",result);
        // })
    };
    // const submit=(dispute)=>{
    //     dispute = fullName !== dispute.raisedUserName ?{...dispute,isValid:1}:{...dispute,isValid:2};
    //     console.log("dispute",dispute);
    //     // RequestHandler("/updateDispute",dispute,'put',props.jwt).then((result)=>{
    //     //     console.log("Ads",result);
    //     // })
    // };
    const disputeViewSolver=(dispute)=>{

        if (dispute.length !==0)
        {
            return(
                dispute.map((d,index)=>{
                    return (
                        <div className="cus-container" style={{overflow:"scroll"}} key={index}>
                            <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} variant="link"  eventKey={index} className="col-md-11 col-lg-11 col-sm-11">
                                <div className="row "><span className=" col d-flex justify-content-start" >{d.title}</span> <span className="col justify-content-start d-flex text-uppercase ">{d.billingDetails.description}</span><span className="col justify-content-end d-flex"><Icon size={30} icon={ic_arrow_drop_down}/></span></div>
                            </ReactBootstrap.Accordion.Toggle>
                            <ReactBootstrap.Accordion.Collapse eventKey={index}>
                            <article className="container">
                                <LightTooltip arrow title="Click if this conflict is solved">
                                    <button className="btn btn-outline-danger cus-btn"
                                            onClick={()=>handleSubmit(d)}
                                            style={{float:"right"}}>
                                        {fullName !==d.raisedUserName ?"Reviewed":"Solved"}
                                    </button>
                                </LightTooltip>
                                <h6>Bill number: {d.billingDetails.transId}</h6>
                                <h6>{fullName !==d.raisedUserName && <span >Raised By: {d.raisedUserName} </span>}</h6>
                                <h6>Bill Date: {new Date(d.billingDetails.date).getFullYear()+"-"+(new Date(d.billingDetails.date).getMonth()+1)+"-"+new Date(d.billingDetails.date).getDate()}</h6>
                                <p>Reason: {d.description}</p>
                            </article>
                            </ReactBootstrap.Accordion.Collapse>
                            {alert.displayAlert&&<AlertModal message={alert.message} callBack={submit} show={alert.displayAlert} hide={()=>setAlert({...alert,displayAlert:false})}/>}
                        </div>
                    );
                })
            );

        }
        else {
            return (
              <div className="settlementList"><h4>You don't have any Conflict</h4></div>
            );
        }

    };
    return(
    <div className="container">
        <ReactBootstrap.Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
            <ReactBootstrap.Tab eventKey="home" title={windowSize.width >768 ?"Conflicts":<span style={{fontSize:"16px"}}>Conflicts</span>}>
                <ReactBootstrap.Accordion className={props.dispute.disputeArray.length ===0&&'justify-content-center align-items-center d-flex'}  style={{marginTop:"10px",overflow:"scroll",maxHeight:"350px"}}>
                    { disputeViewSolver(props.dispute.disputeArray)}
                </ReactBootstrap.Accordion>
            </ReactBootstrap.Tab>
            <ReactBootstrap.Tab eventKey="profile" title={windowSize.width >768 ?"Raised Conflicts":<span style={{fontSize:"16px"}}>Raised Conflicts</span>}>
                <ReactBootstrap.Accordion className={props.dispute.disputeCreated.length ===0&&'justify-content-center align-items-center d-flex'}  style={{marginTop:"10px",overflow:"scroll",maxHeight:"350px"}}>
                    { disputeViewSolver(props.dispute.disputeCreated)}
                </ReactBootstrap.Accordion>
            </ReactBootstrap.Tab>
        </ReactBootstrap.Tabs>
    </div>

    );
};
export default DisputePage;
