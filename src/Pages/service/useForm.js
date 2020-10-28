import React, {useState} from 'react'

export const useForm = (callBack,initialState={},validate)=>{
    const [formField,setFormField] = useState(initialState);
    const [error,setError] = useState({});

    const handleOnChange=event=>{
        setFormField({...formField, [event.target.name]:event.target.value});
        event.target.name && delete error[event.target.name];
    };

    const changeFormField = value=>{
        setFormField(value);
    };
    const handleSubmit=event=>{
        event.preventDefault();
        if (Object.keys(validate(formField)).length === 0)
        {
            callBack(event.target.value);
            setFormField(initialState);
            setError({});
        }
        else {
            setError(validate(formField));
        }
    };

    return {
        handleSubmit,
        handleOnChange,
        changeFormField,
        error,
        formField
    }
};
