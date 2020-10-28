import React from 'react';
import { Icon } from 'react-icons-kit';
import {smileO,edit,remove,bell,caretDown} from 'react-icons-kit/fa/'
import {LightTooltip} from "./service/CustomTooltip";
import {RedTooltip} from "./service/CustomTooltip";
import {RequestHandler} from "./service/RequestHandler";
import * as ReactBootstrap from "react-bootstrap";
import {useWindowSize} from "./service/useWindowSize";

const NewAddedBillList = (props)=>{

    const windowSize = useWindowSize();

    const highlightDisputedRow=(key)=>{
        let checkStatus = props.dispute.disputeArray.reduce((acc,curr) =>{
           if (curr.billingDetails.transId === key)
           {
               acc = true;
           }
          return acc;
       },false);
       return checkStatus;
    };

   const handleRemove = (bill)=>{
      RequestHandler('/removeBill',bill.transId,'delete', props.jwt ).then(result=>{
            if (result)
            {
                props.addBilling();
            }
      });

   };

    //Method for creating and handling tool tip
    const toolTipConst =  (stringNames)=>{
        let names = arraySplit(stringNames);
        const showDetail = names.map((name,index)=> ( <span key={index}><LightTooltip interactive arrow title={name}><a className="cus-tooltip">{name.substring(0,1)},</a></LightTooltip></span>));
        return (showDetail)};

    //method for splitting spring into array
    const arraySplit=(e)=>{
        let value = e.split(",");
        return value;
    };

    //method for converting string to date
    const convertDate=(givenDate)=>{
        let tempDate = new Date(givenDate);
        let tempCons = tempDate.getFullYear()+"-"+(tempDate.getMonth()+1)+"-"+tempDate.getDate();
        return tempCons;
    };

    const mobileView =  props.props.map((bill,key) => {
        let date = convertDate(bill.date);
        return(
            <div className="cus-container" key={key}>
                <div className={`row ${props.dispute.disputeArray.length !== 0 ?(highlightDisputedRow(bill.transId)?"table-warning":null):null}`}>
                    <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} variant="link"  eventKey={key} className="col-md-11 col-sm-11 col-10 col-lg-11 col-xs-11">
                        <div className="row">
                            <span className="col d-flex justify-content-start "><span className="text-uppercase" > {bill.description} </span>  &nbsp;&nbsp; <span className="small"> {date} </span></span>
                            <span className="col-1 d-flex justify-content-end"><Icon size={20} icon={caretDown}/></span>
                        </div>
                    </ReactBootstrap.Accordion.Toggle>
                    {props.user.id === bill.enteredId?
                        <div >
                            <LightTooltip  arrow title="Edit Bill"><a onClick={()=>{ props.callBackEdit(bill)}}  style={{color:"#1E7E34"}}><Icon size={15} icon={edit}></Icon></a></LightTooltip> |
                            <RedTooltip  arrow title="Remove Bill"><a onClick={()=>{handleRemove(bill)}}  style={{color:"red"}}><Icon size={15} icon={remove}></Icon></a></RedTooltip></div>
                        :<RedTooltip  arrow title="Raise Conflict"><a onClick={()=>{props.handleDispute(bill)}}  style={{color:"red"}}><Icon size={15} icon={bell}></Icon></a></RedTooltip>
                    }
                </div>
                <ReactBootstrap.Accordion.Collapse eventKey={key}>
                       <table className="table table-sm table-striped" style={{fontSize:"12px"}}>
                           <tbody>
                           <tr>
                               <td>Id</td>
                               <td> {bill.transId}</td>
                           </tr>
                           <tr>
                               <td>Description</td>
                               <td>{bill.description}</td>
                           </tr>
                           <tr>
                               <td>Date</td>
                               <td> {date} </td>
                           </tr>
                           <tr>
                               <td>Paid Amount</td>
                               <td>{bill.amount}</td>
                           </tr>
                           <tr>
                               <td>Paid By</td>
                               <td>{bill.paidBy}</td>
                           </tr>
                           <tr >
                               <td>Split on</td>
                               <td>{bill.splitedOn.split(",").map(name=>name + ", ")}</td>
                           </tr>
                           </tbody>
                       </table>
                </ReactBootstrap.Accordion.Collapse >

            </div> )

    });

    const deskTopView= ()=>{
      return(<div>
          <table className="cus-table table table-hover table-responsive-lg" >
              <thead>
              <tr>
                  <th>No.</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Paid Amount</th>
                  <th>Paid By</th>
                  <th>Split On</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
              {props.props.map((bill)=>{
                  return(<tr className={`collapsible ${props.dispute.disputeArray.length !== 0 ?(highlightDisputedRow(bill.transId)?"table-warning":null):null}`} key={bill.transId}>
                      <td className="td-bills content">{bill.transId}</td>
                      <td className="td-bills content">{bill.description}</td>
                      <td className="td-bills content">{convertDate(bill.date)}</td>
                      <td className="td-bills content">${bill.amount}</td>
                      <td className="td-bills content">{bill.paidBy}</td>
                      <td className="td-bills content">{toolTipConst(bill.splitedOn)}</td>
                      <td className="content">
                          {props.user.id === bill.enteredId?
                              <div>
                                  <LightTooltip  arrow title="Edit Bill"><a onClick={()=>{ props.callBackEdit(bill)}}  style={{color:"#1E7E34"}}><Icon size={20} icon={edit}></Icon></a></LightTooltip>|
                                  <RedTooltip  arrow title="Remove Bill"><a onClick={()=>{handleRemove(bill)}}  style={{color:"red"}}><Icon size={20} icon={remove}></Icon></a></RedTooltip></div>
                              :<RedTooltip  arrow title="Raise Conflict"><a onClick={()=>{props.handleDispute(bill)}}  style={{color:"red"}}><Icon size={20} icon={bell}></Icon></a></RedTooltip>
                          }
                      </td>

                  </tr>)
              })}
              </tbody>
          </table>
          {/*{isEditedClicked?<BillEntryForm selectedBill={bill} show={true} changeTricker="true"  jwt={jwt} groupMembers={groupMembers} />:null}*/}
      </div>);
    };

    if (props.props.length !== 0) {
     if (windowSize.width <768)
     {
         return <ReactBootstrap.Accordion>{mobileView}</ReactBootstrap.Accordion>
     }
     else {
         return deskTopView();
     }

    }
    else
    {
        return(<div >
            <div className="d-flex justify-content-center" > <img className="cus-happy-img" src={require('../img/happy.png')}/></div>
            <h4>Yeay, No Settlements Due...</h4>
        </div>)
    }

};


export default NewAddedBillList;
