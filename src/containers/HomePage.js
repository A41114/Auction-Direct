import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAllAdminChatboxByAdminId } from '../services/userService';
import './HomePage.scss'
import { REGISTER } from 'redux-persist';
import Home from './Home';
import DgtsTool from './DgtsTool';
import VnaPartnerTool from './VnaPartnerTool';
import Schedule from './Schedule';
import GoogleLogin from '../GoogleLogin';
// import  MyDropdown from "../components/MyDropdown";
import Dropdownmenu from '../components/ui/dropdown-menu'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLessThanEqual,faGavel,faHandshake, faCalendarDays, faMagnifyingGlass,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import {logout} from'../authSlice.js'
import UserNameDropdown from '../components/ui/user-name-dropdown.jsx'
import ChatBox from '../chatbox.js';
import { useNavigate } from 'react-router-dom';
import { withRouter } from '../withRouter'
import { current } from '@reduxjs/toolkit';

import { toast,ToastContainer } from 'react-toastify';
let stt=1;
let csvRows = [];
let getDetailCount=0
class HomePage extends Component {
    
    constructor(props) {
        super(props);
        //khai báo biến local storage
        
        
        
        // console.log('savedCompare',savedCompare)
        this.state={
            startingPrice:'',
            currentHighestPrice:'',
            step:'',
            numberOfStep:'',
            participant:'',
            area:'',
            history:[],
            numberOfStepHistory:[],
            participantHistory:[],
            isDisable:false,
            property:'Tên tài sản: ',
            shortName:'',
            currentPrice:''

        }
    }
    
    
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
      }
      
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          this.handleOnClickPay();
        }
    };
        
    
    handleLogout=()=>{
        this.props.logout(); 
    }
    handleOnChangeInput = (event,inputId)=>{
        const rawValue = event.target.value.replace(/,/g, "").replace(/\D/g, ""); // chỉ giữ số
        let copyState = this.state;

        if(inputId==='startingPrice'){
            copyState['currentHighestPrice']=rawValue;
        }
        copyState[inputId]=rawValue;
        this.setState({
            ...copyState,
        })
    }
    handleOnChangeInputStr = (event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState,
        })
    }
    handleOnClickPay = ()=>{
        if(!this.state.startingPrice){
            toast.error('Nhập thiếu giá khởi điểm')
        }else if(!this.state.step){
            toast.error('Nhập thiếu bước giá')
        }else if(!this.state.area){
            toast.error('Nhập thiếu diện tích')
        }else if(!this.state.numberOfStep){
            toast.error('Nhập thiếu số bước giá')
        }else if(this.state.isDisable===false){
            toast.error('Chưa khóa thông tin')
        }else{
            // let currentHighestPrice = (parseFloat(this.state.currentHighestPrice) + parseFloat(this.state.step)*parseFloat(this.state.numberOfStep))
            // let currentHighestPrice =  parseFloat(this.state.step)*parseFloat(this.state.numberOfStep)
            let {history,currentPrice,participantHistory,numberOfStepHistory}=this.state
            
            currentPrice = (parseFloat(this.state.currentPrice) + parseFloat(this.state.step)*parseFloat(this.state.numberOfStep))
            let newHistory = currentPrice
            history.push(newHistory)
            numberOfStepHistory.push(this.state.numberOfStep)
            participantHistory.push(this.state.participant)

            this.setState({
                // currentHighestPrice:currentHighestPrice,
                history:history,
                currentPrice:currentPrice,
                numberOfStepHistory:numberOfStepHistory,
                participantHistory: participantHistory,
                numberOfStep:'',
                participant:''
            })
            toast.success('Cập nhật giá hiện tại thành công !')
        }
        
    }
    formatNumber = (num)=>{
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    handleLockInfo=()=>{
        // let {history}=this.state
        // let newHistory = parseFloat(this.state.startingPrice)
        // history.push(newHistory)
        this.setState({
            isDisable:!this.state.isDisable,
            // history:history,
            currentPrice:this.state.startingPrice
        })
    }
    // handleGoBack=()=>{
    //     if(this.state.history.length<1){
    //         toast.error('Đang giá khởi điểm')

    //     }else{
    //         let {history}=this.state
    //         if(this.state.history.length>1){
    //             history.pop()
    //         }
    //         // console.log('history.pop()',history[history.length-1])
    //         this.setState({
    //             history:history,
    //             currentPrice:history[history.length-1]
    //         })
    //     }
    // }
    handleGoBack=()=>{
       
        let {history,numberOfStepHistory,participantHistory}=this.state
        if(this.state.history.length>0){
            history.pop()
            // numberOfStepHistory.pop()
            // participantHistory.pop()
        }
        // console.log('history.pop()',history[history.length-1])
        if(this.state.history.length===0){
            this.setState({
                history:history,
                // numberOfStepHistory:numberOfStepHistory,
                // participantHistory:participantHistory,
                currentPrice:this.state.startingPrice,
                numberOfStep:numberOfStepHistory[numberOfStepHistory.length-1],
                participant:participantHistory[participantHistory.length-1]
            })
        }else{
            this.setState({
                history:history,
                // numberOfStepHistory:numberOfStepHistory,
                // participantHistory:participantHistory,
                currentPrice:history[history.length-1],
                numberOfStep:numberOfStepHistory[numberOfStepHistory.length-1],
                participant:participantHistory[participantHistory.length-1]
            })
            
        }
        //AutoFill input với dữ liệu mới nhất,sau đó xóa phần tử đó và lưu vào state
        numberOfStepHistory.pop()
        participantHistory.pop()
        this.setState({
            numberOfStepHistory:numberOfStepHistory,
            participantHistory:participantHistory,
        })
        toast.success('Quay lại thành công')

    }
    addDataToCSV=async(data)=>{
        
            let dataExport=[]
            //Giá khởi điểm
            dataExport.push({'STT':0,'Khách hàng':'Giá khởi điểm','Số bước giá':0+`'`,'Giá trả':this.state.startingPrice+`'`, 'Tổng giá trả':parseFloat(this.state.startingPrice)*this.state.area+`'`
            })
            
            //lịch sử trả giá
            await data.map((item,index)=>{
                // console.log('item: ',item)
                dataExport.push({'STT':stt,'Khách hàng':this.state.participantHistory[index],'Số bước giá':this.state.numberOfStepHistory[index]+`'`,'Giá trả':item+`'`, 'Tổng giá trả':parseFloat(item)*this.state.area+`'`
                })
                stt++
                
            })
            
            // console.log('ex: ',dataExport)
            if (!dataExport || !dataExport.length)return;
            if(csvRows.length<1){
                // Lấy tiêu đề cột
                const headers = Object.keys(dataExport[0]);
                csvRows.push(headers.join(","));

            }
            const headers = Object.keys(dataExport[0]);
            // Thêm dữ liệu từng dòng
            for (const row of dataExport) {
            const values = headers.map(header => `"${row[header]}"`);
            csvRows.push(values.join(","));
            }
            // toast.success("Thêm dữ liệu thành công!");

            this.exportArrayToCSV()
        
        

    }
    exportArrayToCSV=(fileName = "lich_su_tra_gia.csv")=>{
        // Tạo blob và link download
        const csvContent = "\uFEFF" + csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        csvRows=[]
        stt=1
    }
    
    render() {
        // console.log('HOMEPAGE')
        console.log('HOMEPAGE states: ',this.state)
        
        return (
            <div className='container'>
                <div className='content'>
                    <ToastContainer />
                    <div className='auction-direct'>
                        <div className='company-title-container'>
                            <div className='company-title'>Công ty đấu giá hợp danh Vna</div>
                        </div>
                        <div className='auction-direct-top'>
                            <div className='property-name-container'>
                                <div className='property-name-input-container'>
                                    <div className='property-name-input' contentEditable={!this.state.isDisable} placeholder='Nhập tên tài sản' disabled={this.state.isDisable}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text/plain');
                                        document.execCommand('insertText', false, text);
                                      }}
                                    > <strong>Tên tài sản:</strong>Quyền sử dụng đất thuộc thửa đất số 103, tờ bản đồ số 01, Lô DC.A09 thuộc Dự án Trung tâm văn hoá, thể thao, thương mại và đô thị Chí Linh đã được tách thành các ô đất theo quy hoạch chi tiết tỷ lệ 1/2000 đã được UBND tỉnh Hải Dương phê duyệt theo Quyết định số 2135/QĐ-UBND ngày 25/6/2019 gồm 13 ô đất</div>
                                    <input className='short-name'disabled={this.state.isDisable}onChange={(event)=>this.handleOnChangeInput(event, 'shortName') }></input>
                                </div>
                                
                            </div>
                            <div className='property-name-info-container'>
                                <div className='starting-price-container'>
                                    <div className='sub-property-title'>Đơn giá khởi điểm (đồng/m²):</div>
                                    <input className='sub-property-info-input' value={this.formatNumber(this.state.startingPrice)} placeholder='Nhập giá khởi điểm' disabled={this.state.isDisable} onChange={(event)=>this.handleOnChangeInput(event, 'startingPrice')}></input>
                                </div>
                                <div className='step-container'>
                                    <div className='sub-property-title'>Bước giá (đồng/m²):</div>
                                    <input className='sub-property-info-input' value={this.formatNumber(this.state.step)} placeholder='Nhập bước giá' disabled={this.state.isDisable} onChange={(event)=>this.handleOnChangeInput(event, 'step')}></input>
                                </div>
                                <div className='area-container'>
                                    <div className='sub-property-title'>Diện tích (m²):</div>
                                    <input className='sub-property-info-input' value={this.formatNumber(this.state.area)} placeholder='Nhập diện tích' disabled={this.state.isDisable} onChange={(event)=>this.handleOnChangeInput(event, 'area')}></input>
                                </div>
                                <div className='area-container'>
                                    <div className='sub-property-title'>Giá cao nhất hiện tại (đồng/m²):</div>
                                    <input className='sub-property-info-input' value={this.formatNumber(this.state.currentPrice)} disabled='true' onChange={(event)=>this.handleOnChangeInput(event, 'area')}></input>
                                </div>
                            </div>
                        </div>
                        <div className='Lock-info-container'>
                            {this.state.isDisable?
                            <button className='Lock-info' onClick={()=>this.handleLockInfo()}>Mở khóa thông tin</button>:
                            <button className='Lock-info' onClick={()=>this.handleLockInfo()}>Khóa thông tin</button>
                            }
                            <button className='file-export-btn' onClick={()=>this.addDataToCSV(this.state.history)}>Xuất file</button>
                        </div>
                        <div className='auction-direct-mid'>
                            <div>
                                <div className='sub-property-title'>Tên khách hàng trả giá:</div>
                                <input className='number-of-step' placeholder='Nhập tên khách hàng'value={this.state.participant} onChange={(event)=>this.handleOnChangeInputStr(event, 'participant')}></input>
                            </div>
                            <div>
                                <div className='sub-property-title'>Số bước giá khách hàng trả:</div>
                                <input className='number-of-step' placeholder='Nhập số bước giá'value={this.state.numberOfStep} onChange={(event)=>this.handleOnChangeInput(event, 'numberOfStep')}></input>
                            </div>
                            <div className='auction-go-back'>
                                <button className='auction-go-back-btn' onClick={()=>this.handleGoBack()}>Quay lại</button>
                            </div>
                        </div>
                        <div className='auction-direct-bottom'disabled='true'>
                            <div className='sub-property-title'>Tổng giá trả hiện tại (đồng):</div>
                            <div className='current-highest-price'>{this.formatNumber(this.state.currentPrice*parseFloat(this.state.area))}</div>
                        </div>
                    </div>
                    
                </div>
                
                
            </div>
            
        )
    }

}

const mapStateToProps = state => {
    return {
        isLogin: state.auth.isLogin,
        userInfo: state.auth.userInfo,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
