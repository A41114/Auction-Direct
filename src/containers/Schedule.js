import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,sendMail } from '../services/userService';
import './Schedule.scss'
import { REGISTER } from 'redux-persist';
import EmailPreview from './EmailPreview';
import ReactDOMServer from "react-dom/server";
import Calendar from "../components/Calendar.jsx"


class Schedule extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            compare:true,
            dgtsTool:false,
            partnerVnaTool:false,



            fileContent: '',
            auctionAnnoucement:'',
            url:'',

            setFileContent:'',
            content: '',
            text:'',
            fileContent: "",
            searchTerm: "",
            searchResult: "",
            searchKeyWord:"",

            register_Start_End:'',//
            deposit_Start_End:'',//
            starting_Price:'',//
            step:'',//
            fee:'',//
            owner:'',//
            place:'',//
            checking_Property:'',//
            bidding_Start_End:'',//
            deposit:'',//

            //startDate
            SD_Matrix:'',
            //endDate
            ED_Matrix:'',
            //biddingStartDate
            BSD_Matrix:'',
            //biddingEndDate
            BED_Matrix:'',
            //propertyName
            PN:'',

            chosen_schedule:'',
            status:'',
            today:new Date(),

            //email
            from: "dohoangquan1112002@gmail.com",
            to: "dohoangquan110102@gmail.com", // Có thể là nhiều email cách nhau bằng dấu phẩy
            subject: "VNA [THÔNG BÁO] TEST SEND MAIL",
            // text: "Xin chào! Đây là email thông báo lấy lịch thành công",
            text: `Kính gửi Quý Khách hàng.
Cảm ơn Quý khách hàng đã tham gia đấu giá tài sản: Thử nghiệm “Test send mail”.
Tiền đặt trước của Quý Khách hàng sẽ được hoàn trả trong thời hạn 03 ngày làm việc kể từ ngày kết thúc việc đấu giá.
Để xem kết quả đấu giá vui lòng truy cập vào đường link:
http://daugiavna.vn/taisankhac/profile?menu=history
Trân trọng!
`,
            


        }
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        
    }
    //File
    handleFileChange  = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
          this.setState({ fileContent: e.target.result });
        };
    
        reader.readAsText(file);
    };
    //search
    handleSearch=(keyWord)=>{
        return(this.state.fileContent.includes(keyWord))
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
    getData=async()=>{
        try {
            let auctionAnnoucement = await getAuctionAnnouncement({
                url:this.state.url,
                
                type:'schedule',
            },this.props.token)
            // console.log(this.changeDateFormatToCalendar(auctionAnnoucement.SD_Matrix))

            console.log(this.changeDateFormatToCalendar('auctionAnnoucement res: ',auctionAnnoucement))
            let SD_Matrix_Calendar=await this.sortArrbyDate(auctionAnnoucement.SD_Matrix)
            let ED_Matrix_Calendar=await this.sortArrbyDate(auctionAnnoucement.ED_Matrix)
            let BSD_Matrix_Calendar=await this.sortArrbyDate(auctionAnnoucement.BSD_Matrix)
            let BED_Matrix_Calendar=await this.sortArrbyDate(auctionAnnoucement.BED_Matrix)
            this.setState({
                SD_Matrix:this.changeDateFormatToCalendar(SD_Matrix_Calendar,'SD'),
                ED_Matrix:this.changeDateFormatToCalendar(ED_Matrix_Calendar,'ED'),
                BSD_Matrix:this.changeDateFormatToCalendar(BSD_Matrix_Calendar,'BSD'),
                BED_Matrix:this.changeDateFormatToCalendar(BED_Matrix_Calendar,'BED'),
                PN:auctionAnnoucement.PN,
                today:this.formatDate(this.state.today)
            })
            
            // console.log(auctionAnnoucement.BED_Matrix[1][0])
            // console.log(auctionAnnoucement.BED_Matrix.length)
            
            //send mail
            // let htmlString = ReactDOMServer.renderToStaticMarkup(
            //     <EmailPreview name={"Đỗ Hoàng Quân"} message={'Test'} />
            // )
            // let sendMailRes = await sendMail({
            //     from: this.state.from,
            //     to: this.state.to,
            //     subject: this.state.subject,
            //     text: htmlString,
            //     type:'schedule'
            // })
            // console.log('sendMail: ',sendMailRes.errMessage)
            
        } catch (e) {
            console.log(e)
        }
    }
     
    
    handleGetSchedule=async()=>{
        await this.getData()

    }
    //Ngày có định dạng dd/mm/yyyy chuyển về yyyy-mm-dd
    parseDateVN=(str)=>{
        let [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
    }
    parseDateCalendar=(str)=>{
        let [day, month, year] = str.split("/");
        return `${year}-${month}-${day}`;
    }
    //chuyển hôm nay về dd/mm/yyyy
    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng tính từ 0
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    //Sắp sếp theo ngày tăng dần
    sortArrbyDate=(arr)=>{
        if (!Array.isArray(arr)) {
            console.warn("sortArrbyDate: arr is not an array", arr);
            return []; // trả mảng rỗng để không gây crash
        }
        arr.sort((a, b)=>this.parseDateVN(a[0]) - this.parseDateVN(b[0]))
        return arr
    }
    handleOnChangeSchedule = (status)=>{
        let statusMatrix = status+'_Matrix'
        let copyState = this.state;
        this.setState({
            chosen_schedule:copyState[statusMatrix],
            status:status
        })
    }
    changeDateFormatToCalendar=(arr,type)=>{
        // console.log('arr:',this.parseDateCalendar(arr[1][0]))
        for (let i =0;i<arr.length;i++){
            // console.log("parseDateCalendar: ",this.parseDateCalendar(arr[i][0]))
            
            //start date
            
            if(type==='SD'){
                // console.log('base SD',arr[i][0])
                arr[i][0]=this.parseDateCalendar(arr[i][0])+'T08:00:00'
                // console.log('SD',arr[i][0])
            
            //end date
            }else if(type==='ED'){
                arr[i][0]=this.parseDateCalendar(arr[i][0])+'T17:00:00'
            //bidding start/end    
            }else if(type==='BSD'||type==='BED'){
                arr[i][0]=this.parseDateCalendar(arr[i][0])+'T'
            }
        }
        return arr
    }
    
    render() {
        
        // console.log('states: ',this.state)
        // console.log('test_local: ',this.test_local)
        
        return (
            
            <div className='container'>
                <div className='content'>
                    <div className='compare-top-content'>
                    </div>
                    
                    <div className='schedule-bottom-content'>
                        <button className='handle-compare-btn' onClick={()=>this.handleGetSchedule()}>Lấy lịch</button>
                    </div>
                    {this.state.ED_Matrix&&this.state.BED_Matrix&&this.state.SD_Matrix&&this.state.BSD_Matrix&&
                    <div className='choosing-schedule'>
                        <button className={this.state.status==='ED'?'choosing-schedule-btn active':'choosing-schedule-btn'} onClick={()=>this.handleOnChangeSchedule('ED')}>Chốt</button>
                        <button className={this.state.status==='BSD'?'choosing-schedule-btn active':'choosing-schedule-btn'} onClick={()=>this.handleOnChangeSchedule('BSD')}>Đấu</button>
                        <button className={this.state.status==='BED'?'choosing-schedule-btn active':'choosing-schedule-btn'} onClick={()=>this.handleOnChangeSchedule('BED')}>Kết thúc đấu</button>
                        <button className={this.state.status==='SD'?'choosing-schedule-btn active':'choosing-schedule-btn'} onClick={()=>this.handleOnChangeSchedule('SD')}>Bắt đầu đăng ký</button>
                    </div>    
                    }
                    {this.state.status==='ED'&&
                        <div className='schedule-title'>Lịch chốt</div>
                    }
                    {this.state.status==='BSD'&&
                        <div className='schedule-title'>Lịch đấu</div>
                    }
                    {this.state.status==='BED'&&
                        <div className='schedule-title'>Lịch kết thúc đấu</div>
                    }
                    {this.state.status==='SD'&&
                        <div className='schedule-title'>Lịch bắt đầu đăng ký</div>
                    }
                        <div className='schedule-content'>
                        
                            <div className='all-matrix'>
                            {this.state.chosen_schedule&&this.state.chosen_schedule.length>0&&
                                this.state.chosen_schedule.map((item, index)=>{
                                // console.log('item: ',index)
                                    return(
                                        <div className='all-property'>
                                            {item.map((item2,index2)=>{
                                                if(index2===0){
                                                    return(
                                                        <div className={this.state.today===item2?'date active':'date'} key={index2}>{item2}</div>
                                                    )
                                                }else{
                                                    return(
                                                        <div className='code' key={index2}>{item2}</div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    )
                                })
                            }
                            
                            </div>
                        </div>
                        {this.state.BED_Matrix&&
                        <div>
                            <Calendar
                            SD={this.state.SD_Matrix}
                            ED={this.state.ED_Matrix}
                            BSD={this.state.BSD_Matrix}
                            BED={this.state.BED_Matrix}
                            PN={this.state.PN}
                            />
                        </div>
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
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
