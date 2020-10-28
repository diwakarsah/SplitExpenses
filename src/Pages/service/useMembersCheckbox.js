import React, {useEffect, useState} from "react";
import {GreenCheckbox} from "./CustomTooltip";

export const useMembersCheckbox =(members)=> {

    const [checkedMemberList,setCheckedMemberList] =useState([]);
    const [isCheckAll,setIsCheckAll]=useState(false);
    const [groupMembers,setGroupMembers]= useState([]);

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
    useEffect(()=>{
        const readyGroupMembers = members.map(member=>{
            // console.log("memeber",member);
            let index = member.fullName.indexOf("(")===-1 ?member.fullName.indexOf(' '):-1;
            let firstName = index!== -1 ? (member.fullName.substring(0,index)+"_"+member.fullName.substring(index+1,index+4)):member.fullName;

            let temp = {
                "name": firstName,
                "isChecked": false
            };
            return temp;
        });
        setGroupMembers(readyGroupMembers);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[members]);

    console.log("members",groupMembers);
    const checkBoxes =groupMembers.map((member, index) => {
        return (
            <li key={index}>
                <GreenCheckbox checked={member.isChecked} className="custom-checkbox" value={member.name}
                               onChange={(event) => handleCheckBox(event, index)}/>
                <label><span className="text-uppercase cust-checkbox-label">{member.name.substring(0,1)}</span><span style={{fontSize:"12px"}}>{member.name.substring(1,member.size)}</span></label>
            </li>
        );
    });


    return{
        checkBoxes,checkedMemberList,handleCheckBox,isCheckAll,groupMembers
    };
};
