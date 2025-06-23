import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,sendMail,signup } from '../services/userService';
import './Schedule.scss'
import { REGISTER } from 'redux-persist';
import EmailPreview from './EmailPreview';
import ReactDOMServer from "react-dom/server";
import Calendar from "../components/Calendar.jsx"
import './Signup.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import { toast,ToastContainer } from 'react-toastify';
import {loginSuccess} from'../authSlice.js'
class Signup extends Component {
    
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
    handleSignup=async()=>{
        if(!this.state.email||!this.state.fullName||!this.state.password||!this.state.confirmPassword
            ||!this.state.address||!this.state.phoneNumber)
        {
            toast.error('Thiếu trường thông tin bắt buộc')
        }else if(this.state.password!==this.state.confirmPassword){
            toast.error('Xác nhận mật khẩu không khớp')
        }else if(!this.state.termAndPolicyCheckBox){
            toast.error('Chưa đồng ý với điều khoản')
        }else{
            let res= await signup({
                email: this.state.email,
                fullName: this.state.fullName, 
                password:this.state.password,
                address:this.state.address,
                phoneNumber:this.state.phoneNumber,
                gender:this.state.gender,
                roleId:this.state.roleId
            })
            if(res.errCode===0){
                toast.success('Đăng ký thành công')
                this.props.loginSuccess(res.user); // dùng props
                this.props.history.push("/");
            }else{
                toast.error(res.message)
            }
            console.log('res: ',res)
        }
        
    }
    ToLogin=()=>{
        this.props.history.push("/login");
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          this.handleSignup();
        }
    };

    render() {
        
        console.log('states: ',this.state)
        // console.log('test_local: ',this.test_local)
        
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
                                {this.state.accountType==='personal'?
                                <div className='signup-title'>Đăng ký tài khoản cá nhân</div>
                                :
                                <div className='signup-title'>Đăng ký tài khoản doanh nghiệp</div>
                                }
                                <div className='account-type'>
                                    <div className={this.state.accountType==='personal'?'personal active':'personal'} onClick={()=>this.handleOnChangeAccountType('personal')}><FontAwesomeIcon className='compare-icon' icon={faUser}/>Cá nhân</div>
                                    <div className={this.state.accountType==='company'?'company active':'company'} onClick={()=>this.handleOnChangeAccountType('company')}><FontAwesomeIcon className='compare-icon' icon={faBuildingColumns}/>Doanh nghiệp</div>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Họ và tên (*)</div>
                                    <input className='signup-input'onChange={(event)=>this.handleOnChangeInput(event,'fullName')}></input>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Email (*)</div>
                                    <input className='signup-input' type='email'onChange={(event)=>this.handleOnChangeInput(event,'email')}></input>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Mật khẩu (*)</div>
                                    <input className='signup-input' type='password'onChange={(event)=>this.handleOnChangeInput(event,'password')}></input>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Xác nhận mật khẩu (*)</div>
                                    <input className='signup-input' type='password'onChange={(event)=>this.handleOnChangeInput(event,'confirmPassword')}></input>
                                </div>
                                {this.state.confirmPassword&&this.state.password!==this.state.confirmPassword&&
                                <div className='password-not-match'>Mật khẩu xác nhận không khớp</div>
                                }
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Số điện thoại (*)</div>
                                    <input className='signup-input'onChange={(event)=>this.handleOnChangeInput(event,'phoneNumber')}></input>
                                </div>
                                <div className='signup-input-text'>
                                    <div className='signup-text'>Địa chỉ (*)</div>
                                    <input className='signup-input'onChange={(event)=>this.handleOnChangeInput(event,'address')}></input>
                                </div>
                                <div className='signup-select'>
                                    <div className='gender-container'>
                                        <div className='signup-text'>Giới tính</div>
                                        <select className='signup-input'onChange={(event)=>this.handleOnChangeInput(event,'gender')}
                                        isSearchable={true}
                                        value={this.state.gender}
                                        >
                                        <option>Nam</option>
                                        <option>Nữ</option>
                                        <option>Không xác định</option>
                                        </select>
                                    </div>
                                    <div className='role-container'>
                                        <div className='signup-text'>Vai trò</div>
                                        <select className='signup-input'onChange={(event)=>this.handleOnChangeInput(event,'roleId')}
                                        isSearchable={true}
                                        value={this.state.roleId}
                                        >
                                        <option>SuperAdmin</option>
                                        <option>Admin</option>
                                        <option>Khách hàng</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='term-and-policy'>
                                    <input type="checkbox" className='term-and-policy-checkbox' checked={this.state.termAndPolicyCheckBox} onClick={()=>this.handleOnChangeCheckox()} />
                                    <div className='term-and-policy-text'>Tôi cam kết tuân thủ quyền và trách nhiệm của người tham gia đấu giá, chính sách và mọi <span>quy chế hoạt động</span> và <span> chính sách bảo mật</span> tại website đấu giá trực tuyến “daugiavna.vn”</div>
                                </div>
                                <button className='sigup-btn' onClick={()=>this.handleSignup()}>Tạo Tài khoản</button>
                                <div className='already-have-account'>Đã có tài khoản?<span onClick={()=>this.ToLogin()}>Đăng nhập</span></div>
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
       
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginSuccess: (user) => dispatch(loginSuccess(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
