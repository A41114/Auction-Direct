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
class HomePage extends Component {
    
    constructor(props) {
        super(props);
        //khai báo biến local storage
        const savedCompare = JSON.parse(localStorage.getItem('compare'));
        const savedDgtsTool = JSON.parse(localStorage.getItem('dgtsTool'));
        const savedPartnerVnaTool = JSON.parse(localStorage.getItem('partnerVnaTool'));
        const savedSchedule = JSON.parse(localStorage.getItem('schedule'));

        const savedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
        
        
        // console.log('savedCompare',savedCompare)
        this.state={
            compare:savedCompare,
            dgtsTool:savedDgtsTool,
            partnerVnaTool:savedPartnerVnaTool,
            schedule:savedSchedule,
            isLogin:savedIsLogin,
            homepageMenu:'homepage',
            totalChatbox:[],


            startingPrice:'',
            currentHighestPrice:'',
            step:'',
            numberOfStep:'',
            participant:'',
            area:'',
            history:[],
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
        
    handleLogin=()=>{
        //lấy user data

        ///////
        this.setState({
            isLogin:true
        })
        localStorage.setItem('isLogin', JSON.stringify(true));

    }

    handleOnChangeHomepageMenu=(menuItem)=>{
        //test userinfo, token
        if(this.props.userInfo){
            console.log('userInfo: ',this.props.userInfo)
        }
        if(this.props.token){
            console.log('token: ',this.props.token)
        }
        ///////////////////////////////////////////////////
        if(menuItem==='compare'){
            this.setState({
                compare:true,
                dgtsTool:false,
                partnerVnaTool:false,
                schedule:false,
            })
            localStorage.setItem('compare', JSON.stringify(true));
            localStorage.setItem('dgtsTool', JSON.stringify(false));
            localStorage.setItem('partnerVnaTool', JSON.stringify(false));
            localStorage.setItem('schedule', JSON.stringify(false));

        }else if(menuItem==='dgtsTool'){
            this.setState({
                compare:false,
                dgtsTool:true,
                partnerVnaTool:false,
                schedule:false,
            })
            localStorage.setItem('compare', JSON.stringify(false));
            localStorage.setItem('dgtsTool', JSON.stringify(true));
            localStorage.setItem('partnerVnaTool', JSON.stringify(false));
            localStorage.setItem('schedule', JSON.stringify(false));

        }else if(menuItem==='partnerVnaTool'){
            this.setState({
                compare:false,
                dgtsTool:false,
                partnerVnaTool:true,
                schedule:false,
            })
            localStorage.setItem('compare', JSON.stringify(false));
            localStorage.setItem('dgtsTool', JSON.stringify(false));
            localStorage.setItem('partnerVnaTool', JSON.stringify(true));
            localStorage.setItem('schedule', JSON.stringify(false));

        }else if(menuItem==='schedule'){
            this.setState({
                compare:false,
                dgtsTool:false,
                partnerVnaTool:false,
                schedule:true,
            })
            localStorage.setItem('compare', JSON.stringify(false));
            localStorage.setItem('dgtsTool', JSON.stringify(false));
            localStorage.setItem('partnerVnaTool', JSON.stringify(false));
            localStorage.setItem('schedule', JSON.stringify(true));
        }
    }
    handleToNews=()=>{
        // window.location.href = "https://daugiavna.vn/taisankhac/news";
        window.open("https://daugiavna.vn/taisankhac/news", "_blank");
    }
    handleToAboutUs=()=>{
        // window.location.href = "https://daugiavna.vn/taisankhac/news";
        window.open("https://daugiavna.vn/taisankhac/aboutus", "_blank");
    }
    
    ToSignup=()=>{
        // this.props.history.push("/signup");
        // this.props.navigate('/signup')
        this.props.router.navigate('/signup')
    }
    ToLogin=()=>{
        // this.props.history.push("/login");
    }
    ToUserDetails=()=>{
        // this.props.history.push("/UserDetails");
    }
    // componentDidUpdate(prevProps) {
    //     if (prevProps.isLogin !== this.props.isLogin) {
    //         console.log('⚡️ isLogin changed:', this.props.isLogin);
    //         console.log('⚡️ userInfo:', this.props.userInfo);
    //     }
    // }
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
            let {participant,history,currentPrice}=this.state
            
            currentPrice = (parseFloat(this.state.currentPrice) + parseFloat(this.state.step)*parseFloat(this.state.numberOfStep))
            let newHistory = currentPrice
            history.push(newHistory)
            

            this.setState({
                // currentHighestPrice:currentHighestPrice,
                history:history,
                currentPrice:currentPrice
            })
        }
    }
    formatNumber = (num)=>{
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    handleLockInfo=()=>{
        let {history}=this.state
        let newHistory = this.state.startingPrice
        history.push(newHistory)
        this.setState({
            isDisable:!this.state.isDisable,
            history:history,
            currentPrice:newHistory
        })
    }
    handleGoBack=()=>{
        if(this.state.history.length<1){
            toast.error('Đang giá khởi điểm')

        }else{
            let {history}=this.state
            if(this.state.history.length>1){
                history.pop()
            }
            // console.log('history.pop()',history[history.length-1])
            this.setState({
                history:history,
                currentPrice:history[history.length-1]
            })
        }
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
                        </div>
                        <div className='auction-direct-mid'>
                            <div>
                                <div className='sub-property-title'>Số bước giá khách hàng trả:</div>
                                <input className='number-of-step' placeholder='Nhập số bước giá'onChange={(event)=>this.handleOnChangeInput(event, 'numberOfStep')}></input>
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
