(this.webpackJsonpbill_splitter_v1=this.webpackJsonpbill_splitter_v1||[]).push([[17],{341:function(e,t,a){"use strict";a.r(t),a.d(t,"BillEntryForm",(function(){return f}));var n=a(123),l=a(106),c=a(16),i=a(0),s=a.n(i),o=a(68),r=a(119),d=a(28),u=a(113),m=a(25),p=a(111),b=a(110);function f(e){var t={description:"",date:(new Date).getFullYear()+"-"+("0"+((new Date).getMonth()+1)).slice(-2)+"-"+("0"+(new Date).getDate()).slice(-2),amount:"",paidBy:""},a=Object(i.useState)([]),f=Object(c.a)(a,2),g=f[0],h=f[1],E=Object(i.useState)([]),v=Object(c.a)(E,2),k=v[0],O=v[1],B=Object(i.useState)(!1),j=Object(c.a)(B,2),N=j[0],y=j[1],C=Object(i.useState)(""),x=Object(c.a)(C,2),S=x[0],w=x[1],D=Object(i.useState)("Add Bill Details"),I=Object(c.a)(D,2),A=I[0],F=I[1],M=Object(i.useState)(!1),_=Object(c.a)(M,2),P=_[0],R=_[1],U=Object(i.useState)({}),z=Object(c.a)(U,2),H=z[0],J=z[1],Y=function(e,t){-1===t?e.target.checked?(R(!0),O(g.map((function(e){return e.name}))),h(g.map((function(e){return Object(l.a)({},e,{isChecked:!0})})))):(R(!1),O([]),h(g.map((function(e){return Object(l.a)({},e,{isChecked:!1})})))):e.target.checked?(O([].concat(Object(n.a)(k),[g[t].name])),h(g.map((function(e,a){return t===a?Object(l.a)({},e,{isChecked:!0}):e})))):(O(k.filter((function(t){return t!==e.target.value}))),h(g.map((function(e,a){return t===a?Object(l.a)({},e,{isChecked:!1}):e}))))},T=Object(b.a)((function(t){if(0!==k.length){if("Add"===t||"undefined"===typeof t){var a=Object(l.a)({},Q,{groupName:sessionStorage.getItem("groupName"),splitedOn:k.toString(),enteredId:e.user.id});Object(m.a)("/addBillDetails",a,"post",e.jwt).then((function(e){console.log("BillResult",e.status),"undefined"===typeof e.ok?w(!0):w(!1)})),e.addBilling(),O([]),h(g.map((function(e){return Object(l.a)({},e,{isChecked:!1})}))),R(!1),J(!1)}else if("Update"===t){var n=Object(l.a)({transId:e.selectedBill.transId,spittedAmount:e.selectedBill.spittedAmount.toString()},Q,{groupName:sessionStorage.getItem("groupName"),splitedOn:k.toString(),flag:e.selectedBill.flag,enteredId:e.user.id});console.log("csd",n),Object(m.a)("/updateBillDetails",n,"put",e.jwt).then((function(e){console.log("BillResult",e.status),"undefined"===typeof e.ok?(w(!0),J(!1)):w(!1)})),e.addBilling(),O([]),h(g.map((function(e){return Object(l.a)({},e,{isChecked:!1})}))),R(!1),J(!1)}O([]),setInterval((function(){w("")}),2e3)}else J({checkBoxes:"Please tick at least one of the check box"})}),t,r.a),q=T.handleSubmit,G=T.handleOnChange,K=T.changeFormField,L=T.error,Q=T.formField;return Object(i.useEffect)((function(){y(e.show);var t=e.groupMembers.map((function(e){console.log("memeber",e);var t=-1===e.indexOf("(")?e.indexOf(" "):-1;return{name:-1!==t?e.substring(0,t)+"_"+e.substring(t+1,t+4):e,isChecked:!1}}));h(t),null!==e.selectedBill&&function(t){var a={description:e.selectedBill.description,date:new Date(e.selectedBill.date).getFullYear()+"-"+("0"+(new Date(e.selectedBill.date).getMonth()+1)).slice(-2)+"-"+("0"+new Date(e.selectedBill.date).getDate()).slice(-2),amount:e.selectedBill.amount,paidBy:e.selectedBill.paidBy};F("Edit Details"),K(a);var n=e.selectedBill.splitedOn.split(",");O(n),h(t.map((function(e){return-1!==n.indexOf(e.name)?Object(l.a)({},e,{isChecked:!0}):e}))),e.groupMembers.length===n.length&&R(!0)}(t)}),[e.groupMembers,e.show]),s.a.createElement(o.a,{show:N,centered:!0,onHide:e.hide},s.a.createElement(o.a.Header,{closeButton:!0},s.a.createElement(o.a.Title,{className:" txt-color"}," ",A)),s.a.createElement(o.a.Body,null,s.a.createElement("form",null,s.a.createElement("div",{className:"from-group "},s.a.createElement("input",{type:"text",name:"description",onChange:G,value:Q.description,className:"form-control ".concat(L.description&&"is-invalid"),placeholder:"Description"}),L.description&&s.a.createElement("div",{className:"invalid-feedback"},L.description)),s.a.createElement("div",{className:"from-group row"},s.a.createElement("div",{className:"col"},s.a.createElement("input",{type:"date",name:"date",onChange:G,value:Q.date,className:"form-control ".concat(L.date&&"is-invalid"),placeholder:"Enter Date"}),L.date&&s.a.createElement("div",{className:"invalid-feedback"},L.date)),s.a.createElement("div",{className:"col"},s.a.createElement("input",{type:"number",name:"amount",onChange:G,value:Q.amount,className:"form-control ".concat(L.amount&&"is-invalid"),placeholder:"Amount"}),L.amount&&s.a.createElement("div",{className:"invalid-feedback"},L.amount))),s.a.createElement("div",{className:"from-group"},s.a.createElement("select",{className:"form-control ".concat(L.paidBy&&"is-invalid"),name:"paidBy",value:Q.paidBy,onChange:G},s.a.createElement("option",{value:""},"Paid By...."),g.map((function(e,t){return s.a.createElement("option",{value:e.name,key:t},e.name)}))),L.paidBy&&s.a.createElement("div",{className:"invalid-feedback"},L.paidBy)),s.a.createElement("div",{className:"from-group ".concat(H.checkBoxes&&"is-invalid")},s.a.createElement("label",{className:"col-form-label-sm"},"Split On:"),s.a.createElement("ul",{className:"cust-chcekbox"},s.a.createElement("li",null,s.a.createElement(p.a,{onChange:function(e){return Y(e,-1)},checked:P}),s.a.createElement("label",{className:"col-form-label cust-checkbox-label"},"All")),g.map((function(e,t){return s.a.createElement("li",{key:t},s.a.createElement(p.a,{checked:e.isChecked,className:"custom-checkbox",value:e.name,onChange:function(e){return Y(e,t)}}),s.a.createElement("label",null,s.a.createElement("span",{className:"text-uppercase cust-checkbox-label"},e.name.substring(0,1)),s.a.createElement("span",{style:{fontSize:"12px"}},e.name.substring(1,e.size))))})))),H.checkBoxes&&s.a.createElement("div",{className:"invalid-feedback"},H.checkBoxes))),s.a.createElement(o.a.Footer,null,s.a.createElement("div",{style:{marginRight:"auto"}},"  ",!0===S?s.a.createElement("h5",{style:{color:"green"}},"Successfully Added "):!1===S?s.a.createElement("h5",{style:{color:"red"}}," Error!!Please enter again"):null),s.a.createElement("button",{className:"btn btn-secondary",onClick:e.hide},s.a.createElement(d.Icon,{icon:u.close}),"  Close"),null===e.selectedBill?s.a.createElement("button",{type:"button",className:"btn btn-success",value:"Add",onClick:q},s.a.createElement(d.Icon,{icon:u.plus})," Add"):s.a.createElement("button",{type:"button",className:"btn btn-success",value:"Update",onClick:q},s.a.createElement(d.Icon,{icon:u.plus})," Update")))}t.default=f}}]);
//# sourceMappingURL=17.61ad2574.chunk.js.map