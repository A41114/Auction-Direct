import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,sendMail,login } from '../services/userService';
import './Schedule.scss'
import { REGISTER } from 'redux-persist';
import EmailPreview from './EmailPreview';
import ReactDOMServer from "react-dom/server";
import Calendar from "../components/Calendar.jsx"
import './Login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import { toast,ToastContainer } from 'react-toastify';
import actions from '../store/actions/actionTypes.js';
import {loginSuccess} from'../authSlice.js'
import { useDispatch } from 'react-redux';
class Login extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            accountType:'personal',
            fullName:'',
            email:'',
            password:'',
            confirmPassword:'',
            termAndPolicyCheckBox:false,
            phoneNumber:'',
            address:'',
            gender:'Nam',
            roleId:'Admin',
        }
        

        
    }

    
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
      }
      
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    handleOnChangeAccountType=(type)=>{
        this.setState({
            accountType: type
        })
    }
    handleOnChangeInput=(event,target)=>{
        let coppyState=this.state
        coppyState[target]=event.target.value
        this.setState({
            ...coppyState
        })
    }
    handleOnChangeCheckox=()=>{
        this.setState({
            termAndPolicyCheckBox:!this.state.termAndPolicyCheckBox
        })
    }
    handleLogin=async()=>{
        // const dispatch = useDispatch();
        if(!this.state.email||!this.state.password)
        {
            toast.error('Thiếu trường thông tin bắt buộc')
        }else{
            let res= await login({
                email: this.state.email,
                password:this.state.password
            })
            if(res.errCode===0){
                toast.success('Đăng nhập thành công')
                this.props.loginSuccess({
                    userInfo:res.user,
                    token:res.token
                }); // dùng props
                // console.log('res.user',res.user)
                this.props.history.push("/");
            }else{
                toast.error(res.message)
            }
            // console.log('res: ',res)
        }
        
    }
    
    ToSignup=()=>{
        this.props.history.push("/signup");
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          this.handleLogin();
        }
    };

    render() {
        
        console.log('states: ',this.state)

        
        return (
            
            <div className='signup-container'>
                <ToastContainer />
                <div className='signup-content'>
                    <div className='signup-left-content'>
                        <div className='title-container'>
                            <div className='Vna-logo'></div>
                            <div className='Vna-title'>Nền tảng đấu giá trực tuyến</div>
                            <div className='Vna-sub-title'>Tham gia dễ dàng, sở hữu nhanh chóng!</div>
                        </div>
                        <div className='sign-up-img-container'>
                            <div className='sign-up-img'></div>
                        </div>
                    </div>
                    <div className='signup-right-content'>
                        <div className='signup-input-container'>
                            <div className='signup-input-content'>
                                <div className='signup-title'>Đăng nhập</div>
                                
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Email (*)</div>
                                    <input className='signup-input' type='email'onChange={(event)=>this.handleOnChangeInput(event,'email')}></input>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Mật khẩu (*)</div>
                                    <input className='signup-input' type='password'onChange={(event)=>this.handleOnChangeInput(event,'password')}></input>
                                </div>
                                
                                <button className='login-btn' onClick={()=>this.handleLogin()}
                                >Đăng nhập</button>
                                <div className='botom-login'>
                                    <div className='forgot-password'>Quên mật khẩu</div>
                                    <div className='new-account'>Chưa có tài khoản? <span onClick={()=>this.ToSignup()}>Đăng ký</span></div>
                                </div>
                            </div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginSuccess: (user) => dispatch(loginSuccess(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
