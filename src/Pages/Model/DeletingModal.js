import React, {useEffect, useState,useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import {GreenCheckbox} from "../service/CustomTooltip";
import {memberSettlementContext} from "../service/Contexts";
import {RequestHandler} from "../service/RequestHandler";

export function DeletingModal (props){
    const members = useContext(memberSettlementContext);
    const [checkedMemberList,setCheckedMemberList] =useState([]);
    const [groupMembers,setGroupMembers] = useState([]);
    const [result,setResult]=useState({});
    const handleSubmit = ()=>{
        if (props.selectedType==="group")
        {
            const data= checkedMemberList.reduce((acc,curr)=>{
                return  curr.groupId +","+acc
            },"");
            console.log("data",data);
            RequestHandler("/deleteGroup",data,'delete',props.jwt).then(response=>{
               if (typeof response.ok !== "undefined" && !response.ok)
               {
                   setResult({...result,error: "Error!! while deleting group.Please try again"})
               }
               else {
                   sessionStorage.removeItem("groupName")
                   sessionStorage.removeItem("isShown")
                   window.location.reload();
               }
            });
        }

        else {
               let data= checkedMemberList.reduce((acc,curr)=>{
                   return   curr.id +","+acc
               },"");
               data = data + sessionStorage.getItem("groupName");
               console.log("data",data);
               RequestHandler("deleteMember",data,'delete', props.jwt).then(response=>{
                   console.log("res",response.ok);
                  if (typeof response.ok !== "undefined" && !response.ok )
                  {
                      setResult({error:"Error!! Something went wrong while deleting. Please try again"})
                  }
                  else {
                      console.log("asd",response )
                      // props.callBack();
                      // props.hide();
                  }
               });
        }

    };

    const handleCheckBox=(event,index)=>{
            if (event.target.checked)
            {
                setCheckedMemberList([...checkedMemberList,groupMembers[index].name]);
                setGroupMembers(groupMembers.map((member,i)=>(index===i?{...member,isChecked:true}:member)));
            }
            else
            {
                if (props.selectedType ==="group")
                {
                    setCheckedMemberList(checkedMemberList.filter((member)=>{return (member.groupName!==event.target.value)}));
                }
                else
                {
                    setCheckedMemberList(checkedMemberList.filter((member)=>{return (member.fullName!==event.target.value)}));
                }

                setGroupMembers(groupMembers.map((member,i)=>(index===i?{...member,isChecked:false}:member)));
            }
    };

    useEffect(()=>{
        let readyGroupMembers = null;
       if (props.selectedType==="group")
       {
           readyGroupMembers = props.groups.reduce((acc,curr)=>{
               if (curr.createdBy === props.user.id)
               {
                   acc.push( {name:curr,isChecked:false})
               }
               return acc

           },[]);
           setGroupMembers(readyGroupMembers);
       }
       else {

           members.fetchData.then(result=>{
               readyGroupMembers = result.groupMemberList.reduce((acc,curr)=>{
                       if (curr.id !== props.user.id)
                       {
                           acc.push( {name:curr,isChecked:false})
                       }
                       return acc

                   },[]);
                setGroupMembers(readyGroupMembers);
               })
       }


    },[props.groups,props.show,props.selectedType,props.user,members]);
    console.log("asd",checkedMemberList);
    return (
        <Modal show={props.show}  onHide={props.hide}   aria-labelledby="contained-modal-title-vcenter" centered  dialogClassName="cus-modal-dialog">
            <Modal.Header closeButton>
                <Modal.Title className="txt-color">  Please Select to delete </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {result.error&&<h5 className="text-danger">{result.error}</h5>}
                {result.success&&<h5 className="text-success">{result.success}</h5>}
               {groupMembers.length!==0?
                   <div className={`from-group `}>
                    <ul>
                    {props.selectedType ==="group"?groupMembers.map((member,index)=>{
                        return (
                            <li key={index}>
                                    <GreenCheckbox  checked={member.isChecked}  className="custom-checkbox" value={member.name.groupName} onChange={(event)=>handleCheckBox(event,index)}/>
                                   <label><span className="text-uppercase">{member.name.groupName}</span></label>
                               </li>
                        );
                    }):groupMembers.map((member,index)=>{
                        return (
                            <li key={index}>
                                <GreenCheckbox  checked={member.isChecked}  className="custom-checkbox" value={member.name.fullName} onChange={(event)=>handleCheckBox(event,index)}/>
                                <label><span className="text-uppercase">{member.name.fullName}</span></label>
                            </li>
                        );
                    })}
                    </ul>
                    </div>:
                   <h5 className="text-danger">
                       {props.selectedType ==="group"? "There is not any group created by you ..":"No members to delete in this group..."}
                   </h5>
               }
            </Modal.Body>
            <Modal.Footer>

                {checkedMemberList.length !==0 &&<button className="btn btn-success"  onClick={handleSubmit}>
                    Delete
                </button>}
                <button className="btn btn-secondary" onClick={props.hide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}
export default DeletingModal;
