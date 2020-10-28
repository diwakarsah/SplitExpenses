export const validateRegisterForm = (formField)=>{
    let error ={};
    if (formField.password !== formField.confirmPassword)
    {
        error.confirmPassword = "Confirm Password didn't match";
    }
    if (formField.fullName === "")
    {
        error.fullName = "Please enter the name !!";
    }
    else if (!isNaN(formField.fullName))
    {
        error.fullName = "Enter valid name"
    }
    if (formField.phoneNumber === "")
    {
        error.phoneNumber = "Please enter the phone number !!";
    }
    else if (formField.phoneNumber.length>15)
    {
        error.phoneNumber = "Please Enter valid phone number";
    }
    if (formField.userName === "")
    {
        error.userName = "Please enter the userName !!";
    }
    else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formField.userName))
    {
        error.userName = "Please use valid email address "
    }
    if (formField.password === "")
    {
        error.password = "Please enter the password !!";
    }
    else if (formField.password.length <=6)
    {
        error.password = "Password should be more than 6 character";
    }
    return error;
};

export const ValidateBillEntryForm =(formData)=>{
    let errors = {};
    if (formData.description === "")
    {
        errors.description = "Please enter description";
    }
    if (formData.amount === "")
    {
        errors.amount = "Please enter amount";
    }
    else if (isNaN(formData.amount))
    {
        errors.amount = "Amount should be number";
    }
    if (formData.paidBy === "")
    {
        errors.paidBy = "Please select the paid By person";
    }
    if (formData.enteredDate ==="")
    {
        errors.enteredDate = "Please enter data";
    }
    return errors;
};

export  const validateCreateGroup = formData =>{
    let error ={};
    if (formData.gName === "")
    {
        error.gName = "Please enter group name";
    }
    if (formData.name0 === "")
    {
        error.name0 = "Please enter at least one member's phone number"
    }
    return error;
};

export  const validateAddEdMember = formData =>{
    let error = {}
    if(formData.name === "")
    {
        error.name = "Please enter member's name";
    }
    if (formData.number === "")
    {
        error.number = "Please enter phone number";
    }
    else if (formData.number.length >14 )
    {
        error.number = "Please enter valid phone number";
    }
    return error;
};
