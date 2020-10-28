import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-image-crop/dist/ReactCrop.css';
import { createWorker } from 'tesseract.js';
import { RequestHandler } from "./service/RequestHandler";
import {loginContext, memberSettlementContext, userDetailsContext} from "./service/Contexts";
import BootstrapTable from "react-bootstrap-table-next";
import NavBar from "./NavBar";
import MembersSelectionModal from "./Model/MembersSelectionModal";
// import {ReduceSettlementList} from "./service/ReduceSettlementList";


function UploadBill(props) {
    const cookiesData = useContext( loginContext );
    const memberSettlement = useContext(memberSettlementContext);

    const [ isProcessing, setIsProcessing ] = useState(false );
    const [ ocrText, setOcrText ] = useState('');
    const [ completedPctg, setCompletedPctg ] = useState('0.00' );
    const jwt =  cookiesData.stateData.jwt;
    const [ worker, setWorker ] = useState( React.createRef() );
    // const [ billTexts, setBillTexts ] = useState( [] );
    const [ results, setResults ] = useState( [] );
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const [cropReady, setCropReady] = useState(false);
    const [cropComplete, setCropComplete] = useState(false);
    const [previewUrl, setPreviewUrl] = useState();
    const [croppedBlob, setCroppedBlob] = useState(null);

    let userSelectedItems= [];
    const [isMemberSelectionOpened,setMemberSelectionOpened] = useState(false);

    const callBackFetchingInformation =()=>{

        memberSettlement.dispatch({type:"ADD",payload:jwt});

    };


    useEffect(()=>{
        // Logs the output object to Update Progress, which
        // checks for Tesseract JS status & Updates the progress
        setWorker( createWorker({
            logger: m => updateProgressAndLog(m),
        }));
    },[]);

    useEffect(()=>{
        if (ocrText !== ''){
            const val = { billText : ocrText };
            parseBillText( val );
        }
    },[ ocrText ]);

    // useEffect( ()=>{
    //     if (results.length > 0) {
    //         RequestHandler('/homeDetails',groupName,'get',jwt).then(result=>{
    //             console.log(result);
    //             setGroupMembers(result.groupMemberList);
    //         });
    //     }
    // }, [ results ] );

    const updateProgressAndLog = ( m )=>{

        // Maximum value out of which percentage needs to be
        // calculated. In our case it's 0 for 0 % and 1 for Max 100%
        // DECIMAL_COUNT specifies no of floating decimal points in our
        // Percentage
        const MAX_PARCENTAGE = 1 ;
        const DECIMAL_COUNT = 2 ;

        if( m.status === "recognizing text" ){
            const pctg = ( m.progress / MAX_PARCENTAGE ) * 100;
            setCompletedPctg(pctg.toFixed( DECIMAL_COUNT ));
        }
    };

    async function doOCR( file ) {
        setIsProcessing(true);
        //
        // Loading tesseract.js functions
        await worker.load();
        // Loadingg language as 'English'
        await worker.loadLanguage('eng');
        await worker.initialize( 'eng' );
        // Sending the File Object into the Recognize function to
        // parse the data
        const { data: { text } } = await worker.recognize( file );

        setIsProcessing(false);
        setOcrText(text);
    }

    function parseBillText( val ) {
        RequestHandler('/parseBill', val, 'post', jwt).then(result => {
               let res = [];
                result.map((x)=>{
                    res.push({SN:x.SN, item:x.item, price:x.price});
                });
                // console.log(res);
                // setResults(result);
                setResults(res);
        });
    }

    const columns = [{
        dataField: 'SN',
        text: 'SN'
    }, {
        dataField: 'item',
        text: 'Item Description'
    }, {
        dataField: 'price',
        text: 'Item Price'
    }];

    const data = results;

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            // console.log(row.SN);
            // console.log(row.item);
            // console.log(row.price);
            // console.log(isSelect);
            if (isSelect) {
                userSelectedItems.push(row);
            }
            else{
               if (userSelectedItems.length !== 0)
               {
                 userSelectedItems = userSelectedItems.filter(item=>(item.SN !== row.SN));
               }
            }
            console.log("from one 1",userSelectedItems);
        },
        onSelectAll: (isSelect, rows, e) => {
            // console.log(rows);
            // console.log(isSelect);
            if (isSelect)
            {
                userSelectedItems = [];
                userSelectedItems =rows;
            }
            else {
                userSelectedItems = [];
            }
            console.log("all items",userSelectedItems);
        }

    };


    const [crop, setCrop] = useState({
        unit: '%',
        x: 13,
        y: 13,
        width: 25,
        height: 25
    });


    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            // loadImage(
            //     e.target.files[0],
            //     (img) => {
            //       var base64data = img.toDataURL(`image/jpeg`);
            //       setUpImg(base64data);
            //     },
            //     { orientation: 1, canvas: true }
            // );
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback(img => {
        imgRef.current = img;
    }, []);

    useEffect(()=>{
        if (croppedBlob && cropComplete){
            // BillOCR.doOCR();
        }
    }, [croppedBlob]);

    const makeClientCrop = async crop => {
        console.log(crop);
        if (imgRef.current && crop.width && crop.height) {
            await createCropPreview(imgRef.current, crop, "newFile.jpeg");
        }
    };

    const cropReadyChange = () => {
        if (!cropReady){
            setCropReady(true);
        }
    };

    const cropCompleteChange = () => {
        if (!cropComplete) {
            setCropComplete(true);
        }
    };

    const createCropPreview = async (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                blob.name = fileName;
                console.log(blob);
                window.URL.revokeObjectURL(previewUrl);
                setCroppedBlob(blob);
                setPreviewUrl(window.URL.createObjectURL(blob));
            }, "image/jpeg");
        });
    };
    // console.log("groupMembers",groupMembers)
    return (

        <div className="App">
            <header>
                <NavBar
                    mainProps={props}
                    isDisputeDisplay={false}
                    callBack={callBackFetchingInformation}
                />
            </header>
            <div className="upload">
                <div className="container">
                    <div style={{marginTop : "10%"}} className="row">
                        <div className="col-md-4">

                        </div>
                        <div className="col-md-4">
                            {/*<FilePond ref={ ref => setPond( ref ) } onaddfile={ ( err, file ) => { doOCR( file ); } }*/}
                            {/*          onremovefile={ ( err, file ) => { setOcrText( '' ); setResults( [] ); } }*/}
                            {/*/>*/}
                            <input type="file" accept="image/*" onChange={onSelectFile} />
                        </div>
                        <div className="col-md-4">

                        </div>
                    </div>
                </div>

            </div>
            {/*{console.log('UpImg: ' + upImg)}*/}
            <div className="crop">
                {upImg && !cropReady && <img alt="selected Image" src={upImg} style={{maxHeight : "300px"}}/>}
                {upImg && !cropReady && <input type="button" value="Crop" onClick={cropReadyChange}/>}
                {cropReady && !cropComplete && <ReactCrop
                    src={upImg}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={makeClientCrop}
                />}
                {cropReady && !cropComplete && <input type="button" value="Complete" onClick={cropCompleteChange}/>}
                <div>
                    {cropComplete && previewUrl && <img alt="Crop preview" src={previewUrl} style={{maxHeight : "300px"}}/>}
                </div>
                {upImg && <input type="button" value="Submit" onClick={()=>doOCR(croppedBlob != null ? croppedBlob: upImg)}/>}
            </div>
            <div className="result">
                <div>
                    <h5 className="card-header text-center font-weight-bold text-uppercase py-4">
                        <div style={{margin : "1%", textAlign: "left"}} className="row">
                            <div className="col-md-12">
                                <i className={"fas fa-sync fa-2x " + (isProcessing ? "fa-spin" : "")}></i> <span className="status-text">{isProcessing ? `Processing Image ( ${completedPctg} % )` : "Bill"} </span>
                            </div>

                        </div>

                    </h5>
                </div>
                <div>
                    <button className="btn btn-success" onClick={()=>setMemberSelectionOpened(true)}>Add</button>
                    <BootstrapTable
                        keyField='SN'
                        data={ data }
                        columns={ columns }
                        selectRow={ selectRow }
                    />
                </div>
            </div>
            {isMemberSelectionOpened && <MembersSelectionModal selectedItems={userSelectedItems} show={isMemberSelectionOpened} hide={()=>setMemberSelectionOpened(false)} />}
        </div>
    );
}

export default UploadBill;
