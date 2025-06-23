import React from 'react';


import './HomePage.scss'


    
function EmailPreview({ name, message }) {
    return (
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px", display:'flex',flexDirection: 'column', justifyContent:'center' }}>
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px", display:'flex', justifyContent:'center', fontWeight:'bold', fontSize:'80px' }} >Xin chào {name}</div>
        <div style={{ backgroundColor: "#f0f0f0", padding: "20px", display:'flex', justifyContent:'center'}} >Đây là văn bản test send mail với css</div>
        <p>{message}</p>
        </div>
    );
}
      
    
    




export default EmailPreview; 
