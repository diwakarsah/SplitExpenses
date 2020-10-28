import React, {useEffect, useState} from 'react';
import { Icon } from 'react-icons-kit';
import {caretDown,caretUp,edit} from 'react-icons-kit/fa/'
import * as ReactBootstrap from 'react-bootstrap';
import {RequestHandler} from "./service/RequestHandler";
import AlertModal from "./Model/AlertModal";
import {LightTooltip} from "./service/CustomTooltip";


const SettlementListDisplay = (props)=>{

    let settlementArray = Object.entries(props.settlementList);
    const [selectedItem,setSelectedItem] = useState({date:"",settlementId:""});
    const [showAlert, setShowAlert]= useState({status:false,message:""});
    const [isActive,setActive]= useState({});
    const keyObjects  =settlementArray.reduce((acc,curr,index)=>{
        acc["key"+index]=false;
        return acc;
    },{});

    const handleEdit=(date,settlementId)=>{
      if (props.billingList.length === 0)
      {
          setSelectedItem({date:date,settlementId:settlementId});
          setShowAlert({status:true,message: " Are you sure ? You wanna edit the settlement? "});
      }
      else {
          setShowAlert({status:true,message: "Error!!..The invoices' settlement should be done before editing previous settlement "})
      }
    };

    const retrieveSettlement = ()=>{
        let formData = {groupName:sessionStorage.getItem('groupName'),
            startDate:selectedItem.date.substring(0,10),
            endDate:selectedItem.date.substring(14,24),
            settlementId:selectedItem.settlementId
        };
        RequestHandler("/retrieveBill",formData,'put',props.jwt).then(
            (result)=>{
                    if (result)
                    {
                        props.callBack();
                    }
                })};

    const handleSelectedAccordion = (key)=>{
        console.log("Settlement",isActive);
        console.log("key",key);
        if (key!== null) {
            key="key"+key;
            setActive({[key]:!isActive[key]})
        }
        else {
            setActive(keyObjects);
        }
    };


    useEffect(()=>{
        setActive(keyObjects);

    },[props.settlementList]);


    if (settlementArray.length !== 0) {
     const returnValue =  settlementArray.map((value,key) => {
            let isEditable = value[1][0].settlementDoneBy === props.user.id;
          return(
              <div className="cus-container" key={key}>
                  <div className="row">
                  <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} variant="link"  eventKey={key} className="col-md-11 col-sm-11 col-10 col-lg-11 col-xs-11">
                      <div className="row">
                          <span className="col d-flex justify-content-start "><span className="hide-container"> From </span> &nbsp;&nbsp; <span> {value[0]} </span>  &nbsp;&nbsp; <span className="hide-container"> settlements </span></span>
                          <span className="col-1 d-flex justify-content-end">{isActive["key"+key]?<Icon size={30} icon={caretUp}/>:<Icon size={30} icon={caretDown}/>}</span>
                      </div>
                  </ReactBootstrap.Accordion.Toggle>
                      {isActive["key"+key]&& isEditable &&<div className="col-md-1 col-sm-1 col-1">
                          <LightTooltip placement="top" title="Edit Settlement">
                              <span className="text-danger">
                                  <Icon onClick={()=>handleEdit(value[0], value[1][0].id)} icon={edit}/>

                              </span>
                          </LightTooltip>
                      </div>}
                  </div>
                  <ReactBootstrap.Accordion.Collapse eventKey={key}>
                      <>
                      <ul className="cus-list" key={key} id="example-collapse-text">
                          {value[1].map((settle)=>{
                              const list = settle.settlementPaymentDetails.map((person,index)=>{
                                  return(<li key={index}>{person.paidBy} pays {person.paidTo} = {person.amount.toFixed(2)} </li>);
                              });
                              return list;
                          })}
                      </ul>
                      </>
                  </ReactBootstrap.Accordion.Collapse >

              </div> )

        });
        return ( <ReactBootstrap.Accordion  onSelect={e=>{handleSelectedAccordion(e)}}>{returnValue}
           {showAlert.status &&<AlertModal show={showAlert.status} message={showAlert.message} callBack={retrieveSettlement} hide={()=>setShowAlert({...showAlert,status:false})}/>}
        </ReactBootstrap.Accordion> ) ;

    }
    else
    {
        return(<div className="settlementList">
            <p>
                <span> <img className="cus-happy-img" src={require('../img/happy.png')}/></span>
                <span className="h4"> No Settlements List...</span>
           </p>
        </div>)
    }

}
export default SettlementListDisplay;
