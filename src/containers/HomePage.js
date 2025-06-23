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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLessThanEqual,faGavel,faHandshake, faCalendarDays, faMagnifyingGlass,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import {logout} from'../authSlice.js'
import UserNameDropdown from '../components/ui/user-name-dropdown.jsx'
import ChatBox from '../chatbox.js';
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
        }
    }
    
    
    async componentDidMount () {
        if(this.props.userInfo){
            
            if(this.props.userInfo.roleId==='Admin'){
                // console.log(this.props.userInfo)
                let resChatbox = await getAllAdminChatboxByAdminId(this.props.userInfo.id)
                // console.log('resChatbox: ',resChatbox.chat)
                this.setState({
                    totalChatbox : resChatbox.chat
                })
            }
        }
    }
        
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
        this.props.history.push("/signup");
    }
    ToLogin=()=>{
        this.props.history.push("/login");
    }
    ToUserDetails=()=>{
        this.props.history.push("/UserDetails");
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
    
    render() {
        // console.log('HOMEPAGE')
        // console.log('HOMEPAGE states: ',this.state.totalChatbox.length)
        
        return (
            <div className='container'>
                <div className='content'>
                    <div className='bottom-content-homepage'>
                        <div className='vna-top-content'>
                            <div className='vna-blank-top'></div>
                            <div className='nav-bar'>
                                <div className='vna-logo'></div>
                                <div className='vna-menu'>
                                    
                                    <div className={this.state.homepageMenu==='homepage'?'menu-item-homepage active':'menu-item-homepage'}>Trang chủ</div>
                                    
                                    <Dropdownmenu
                                        handleOnChangeHomepageMenu={this.handleOnChangeHomepageMenu}
                                    />
                                    <div className='menu-item-news' onClick={()=>this.handleToNews()}>Thông báo và tin tức</div>
                                    <div className='menu-item-about-us' onClick={()=>this.handleToAboutUs()}>Về chúng tôi</div>
                                </div>
                                {!this.props.userInfo?
                                <div className='vna-btn'>
                                    <button className='signup-btn'onClick={()=>this.ToSignup()}>Đăng ký</button>
                                    <button className='login-btn'onClick={()=>this.ToLogin()}>Đăng nhập</button>
                                </div>
                                :
                                <div className='signed-in'>
                                    <div className='user-name'><UserNameDropdown userName={this.props.userInfo.fullName} handleLogout={this.handleLogout} ToUserDetails={this.ToUserDetails}/></div>
                                </div>
                                }
                                
                            </div>
                            <div className='vna-find-property-title'>
                                Tìm kiếm tài sản đấu giá
                            </div>
                            <div className='vna-find-property-sub-title'>
                                Chọn tài sản đấu giá và bắt đầu tìm kiếm
                            </div>
                            <div className='vna-homepage-search-container'>
                                <div className='vna-homepage-search-content'>
                                    <div className='vna-property-type'>
                                        
                                        <div className={this.state.compare?'type-item active':'type-item'} onClick={()=>this.handleOnChangeHomepageMenu('compare')}><FontAwesomeIcon className='compare-icon' icon={faLessThanEqual}/>So sánh</div>
                                        <div className={this.state.dgtsTool?'type-item active':'type-item'} onClick={()=>this.handleOnChangeHomepageMenu('dgtsTool')}><FontAwesomeIcon className='compare-icon' icon={faGavel}/>ĐGTS</div>
                                        <div className={this.state.partnerVnaTool?'type-item active':'type-item'} onClick={()=>this.handleOnChangeHomepageMenu('partnerVnaTool')}><FontAwesomeIcon className='compare-icon' icon={faHandshake}/>Partner</div>
                                        <div className={this.state.schedule?'type-item active':'type-item'} onClick={()=>this.handleOnChangeHomepageMenu('schedule')}><FontAwesomeIcon className='compare-icon' icon={faCalendarDays}/>Schedule</div>
                                    </div>
                                    <div className='vna-search-input-container'>
                                        <input className='vna-search-input' placeholder='Tìm kiếm'></input><span className='search-icon-container'><FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass}/></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.compare&&
                        <Home/>
                    }
                    {this.state.dgtsTool&&
                        <DgtsTool/>
                    }
                    {this.state.partnerVnaTool&&
                        <VnaPartnerTool/>
                    }
                    {this.state.schedule&&
                        <Schedule/>
                        
                    }

                    
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
