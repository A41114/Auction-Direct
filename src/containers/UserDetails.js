import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,createNewRecruitment } from '../services/userService';
import './DgtsTool.scss'
import { REGISTER } from 'redux-persist';


class UserDetails extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={

            
        }


        
    }


    
    componentDidMount() {

    }


    
    handleOnChangeInput = (event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState,
        })
    }

    
    // componentDidUpdate(prevProps, prevState) {
    //     // // So sánh trạng thái và thuộc tính hiện tại với trước đó
    //     // if (this.state.auctionAnnoucement !== prevState.auctionAnnoucement) {
    //     //     // Thực hiện một số hành động khi state thay đổi
    //     //     console.log('State đã thay đổi!');
    //     // }
    // }
  
    
    render() {
        
        // console.log('states: ',this.state)
        
        return (
            <div className='container'>
                User details
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
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
