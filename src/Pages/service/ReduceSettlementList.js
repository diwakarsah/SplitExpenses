const convertDate=(givenDate)=>{
    let tempDate = new Date(givenDate);
    let tempCons = tempDate.getFullYear() + "-" + ("0" + (tempDate.getMonth()+1)).slice(-2) + "-" + ("0" + tempDate.getDate()).slice(-2)
    return tempCons;
}

export const ReduceSettlementList = (settlements)=>{
    const reduced = settlements.reduce((pre,cur)=>{
        let key = convertDate(cur.startDate) + " to "+ convertDate(cur.endDate);
            if (  !pre[key] ) {

                 pre[key]= new Array(cur);
                return pre
            }
            else
            {
                pre[key].push(cur);
                return pre;

            }

    },{});
    return reduced;
};
