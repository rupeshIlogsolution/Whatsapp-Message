import './App.css'
import * as XLSX from "xlsx";
import Formate from '../Whatsapp_formate.xlsx'
import { useState } from 'react'


const Sendmessage = () => {

    const [importdata, setImportdata] = useState([]);
    const [emptyfileerror, setEmptyfileerror] = useState(false);



    const Sendmessage = () => {
        if (importdata.length === 0) {
            setEmptyfileerror(true)
        }
        else {
            setEmptyfileerror(false)
            let message = document.getElementById("message").value;
             message= message.replace(/’/g, '');
            //   message= message.replace(/(?:\r\n|\r|\n)/g, '<br>');
              message= message.replace(/(?:\r\n|\r|\n)/g, ' ');


            const data= {
                importdata, message
            }

            async function apicall(data) {
                await fetch('http://localhost:3008/api/insertwhatsappdata', {
                    method: 'POST', 
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(data => {
                        if(data[0]===undefined){
                            alert("error")
                            window.location.reload();
                        }
                        else{

                            
                            // alert("send")
                            // window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
            apicall(data);
        }

    }


    //##########################  for convert excel to array start  #################################
    const onChange = (e) => {
        const [file] = e.target.files;
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            let data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            data = data.replace(/,/g, ' ')
            data = data.replace(/"/g, '')
            data = data.replace(/’/g, '')
            var lines = data.split("\n");
            var result = [];
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length - 1; i++) {
                var obj = {};
                var currentline = lines[i].split(",");
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            setImportdata(result);
            if (importdata.length === 0) { }
            else {
                const array = JSON.stringify(importdata)
                const datas = JSON.parse(array)
                setImportdata(datas);
            }

        };
        reader.readAsBinaryString(file);
    };

    return (
        <>
            <div className="container" >
                <div className="box">
                    <h1>Send Whatsapp Message</h1>
                    <div>
                        <label htmlFor=""><b>Select the excel file :-</b></label><br />  <br />

                        <input type="file" onChange={onChange} accept=".xlsx" />
                        <a href={Formate} download>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                            </svg>&nbsp;
                            Formate
                        </a>
                    </div> <br />
                    {
                        emptyfileerror ?
                            <small>Please! select the file. . .</small> : null
                    }
                    <br />
                    <div>
                        <label htmlFor="message"><b>Message :-</b></label><br />
                        <textarea name="message" id="message"></textarea>
                    </div>
                    <br />

                    <button style={{ float: "right" }} onClick={Sendmessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                        </svg>
                        &nbsp;
                        Send
                    </button>

                </div>
            </div>
        </>
    )
}

export default Sendmessage;