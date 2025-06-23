import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,createNewRecruitment } from '../services/userService';
import './DgtsTool.scss'
import { REGISTER } from 'redux-persist';


class DgtsTool extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            fileContent: '',
            fileContent: "",



            owner:'',
            owner_Address:'',
            bidding_Start_Fulltime:'',
            aucAddress:'',

            aucRegTimeStart:'',//tg bắt đầu đăng ký và đặt trước theo tg đăng ký
            aucRegTimeEnd:'',//tg kết thúc đăng ký và đặt trước theo tg đăng ký
            aucCondition:'',

            propertyViewLocation:'',
            fileSellLocation:'',

            aucType:'',
            aucMethod:'',

            propertyName:'',
            propertyPlace:'',
            propertyStartPrice:'',
            depositUnit:'',
            deposit:'',
            fileCost:'',
            
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
    //Format Time
    formatTime=(timeString)=>{
        // Tách giờ, phút từ chuỗi gốc
        let [hour, minute] = timeString.split(":");
      
        // Chuyển đổi giờ về dạng số và loại bỏ số 0 đầu tiên (nếu có)
        // hour = parseInt(hour, 10); // Convert "08" → 8
      
        // Ghép lại thành định dạng "8h00'"
        return `${hour}h${minute}’`;
    }
    formatTime2(timeString) {
        let [hour, minute] = timeString.split(":");
      
        // Đảm bảo giờ và phút có 2 chữ số (thêm '0' nếu cần)
        hour = hour.padStart(2, "0"); // Nếu là "9" → "09"
        minute = minute.padStart(2, "0"); // Nếu là "5" → "05"
      
        return `${hour} giờ ${minute} phút`;
    }
    //format date
    formatDate = (date) => {
        // Tách chuỗi ngày tháng thành các phần
        const parts = date.split('/');
        
        // Loại bỏ số 0 ở đầu ngày và tháng
        const day = parts[0].replace(/^0+/, '');
        const month = parts[1].replace(/^0+/, '');
        const year = parts[2];

        // Trả về chuỗi ngày tháng đã được xử lý
        return `${day}/${month}/${year}`;
    };
    
    handleOnChangeInput = (event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState,
        })
    }
    getData=async()=>{
        try {
            const formData = new FormData();
            formData.append('file', this.state.selectedFile);
           
            let auctionAnnoucement = await getAuctionAnnouncement({
                owner:this.state.owner,
                owner_Address:this.state.owner_Address,
                bidding_Start_Fulltime:this.state.bidding_Start_Fulltime,
                aucAddress:this.state.aucAddress,

                aucRegTimeStart:this.state.aucRegTimeStart,//tg bắt đầu đăng ký và đặt trước theo tg đăng ký
                aucRegTimeEnd:this.state.aucRegTimeEnd,//tg kết thúc đăng ký và đặt trước theo tg đăng ký
                aucCondition:this.state.aucCondition,

                propertyViewLocation:this.state.propertyViewLocation,
                fileSellLocation:this.state.fileSellLocation,

                aucType:this.state.aucType,
                aucMethod:this.state.aucMethod,

                propertyName:this.state.propertyName,
                propertyPlace:this.state.propertyPlace,
                propertyStartPrice:this.state.propertyStartPrice,
                depositUnit:this.state.depositUnit,
                deposit:this.state.deposit,
                fileCost:this.state.fileCost,

                type:'dgts'


            })
        } catch (e) {
            console.log(e)
        }
    }
     
    
    handleCompare=async()=>{
        await this.getData()

    }
    // componentDidUpdate(prevProps, prevState) {
    //     // // So sánh trạng thái và thuộc tính hiện tại với trước đó
    //     // if (this.state.auctionAnnoucement !== prevState.auctionAnnoucement) {
    //     //     // Thực hiện một số hành động khi state thay đổi
    //     //     console.log('State đã thay đổi!');
    //     // }
    // }
    handleGetText=async()=>{
        //Chủ tài sản
        let owner = this.state.fileContent.match(/Đơn vị có tài sản:\s*(.+?)\;/i);
        if (owner && owner[1]) {
            // console.log("Chủ tài sản là:", owner[1]);
            this.setState({
                owner:owner[1]
            })
        } else {
        console.log("Không tìm thấy chủ tài sản.");
        }

        //Địa chỉ chủ tài sản
        let owner_Address = this.state.fileContent.match(/[-+•\d.\s]*Đơn vị có tài sản:.*?Địa chỉ:\s*(.+?)\./i);
        console.log('owner_Address: ',owner_Address)
        if (owner_Address && owner_Address) {
            this.setState({
                owner_Address:owner_Address[1]
            })
        } else {
        console.log("Không tìm thấy địa chỉ người có tài sản.");
        }
        

        //Hình thức và phương thức đấu giá, kiểm tra chuỗi rồi trả về 0,1,2..
        let auction_Type=this.state.fileContent.match(/Hình thức và phương thức đấu giá:\s*(.+?)\./i);

        if (auction_Type && auction_Type){
            // console.log("Hình thức đấu giá là:", auction_Type[1]);
            if(auction_Type[1].toLocaleLowerCase().includes('bằng lời nói')){
                await this.setState({
                    aucType:1
                })
            }else if(auction_Type[1].toLocaleLowerCase().includes('trực tiếp')){
                await this.setState({
                    aucType:2
                })
            }else if(auction_Type[1].toLocaleLowerCase().includes('gián tiếp')){
                await this.setState({
                    aucType:3
                })
            }else if(auction_Type[1].toLocaleLowerCase().includes('trực tuyến')){
                await this.setState({
                    aucType:4
                })
            }

            if(auction_Type[1].includes('trả giá lên')){
                this.setState({
                    aucMethod:1
                })
            }else if(auction_Type[1].includes('trả giá xuống')){
                this.setState({
                    aucMethod:2
                })
            }
        } else {
            console.log("Không tìm thấy hình thức đấu giá.");
        }


        //Thời gian đấu giá
        let bidding_Start_Full_Time = this.state.fileContent.match(/Thời gian:\s*(.+?ngày\s*\d{1,2}\/\d{1,2}\/\d{4})/i);
        let regex=''
        if(this.state.aucType===4){
            regex = /(\d{1,2}) giờ (\d{1,2}) phút.*?ngày (\d{1,2})\/(\d{1,2})\/(\d{4})/;
        }else{      
            regex = /(\d{1,2})h(\d{2})[’']?\s*ngày\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        }
        let  bidding_Start_Time = bidding_Start_Full_Time[1].match(regex);
        if (bidding_Start_Time) {
            const gio = bidding_Start_Time[1].padStart(2, '0');     // Giờ đầu tiên
            const phut = bidding_Start_Time[2].padStart(2, '0');    // Phút đầu tiên
            const ngay = bidding_Start_Time[3].padStart(2, '0');    // Ngày đầu tiên
            const thang = bidding_Start_Time[4].padStart(2, '0');   // Tháng
            const nam = bidding_Start_Time[5];                      // Năm
          
            const time = `${gio}:${phut}`;
            const date = `${ngay}/${thang}/${nam}`;
            
            const bidding_Start_Fulltime = date+' '+time
            // console.log(bidding_Start_Fulltime) 
            this.setState({
                bidding_Start_Fulltime:bidding_Start_Fulltime
            })
        } else {
            console.log("Không tìm thấy thông tin.");
        }


        //Địa điểm đấu giá
        let aucAddress = this.state.fileContent.match(/Địa điểm:\s*(.+?)\./i);
        if (aucAddress && aucAddress[1]) {
            // console.log("Địa điểm đấu giá là:", aucAddress[1]);
            this.setState({
                aucAddress:aucAddress[1]
            })
        } else {
            console.log("Không tìm thấy địa điểm đấu giá.");
        }


        //Thời gian đăng ký/đặt cọc theo tg đăng ký(?:\s*là\s*)?
        let aucRegTimeFull = this.state.fileContent.match(/Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá(?:\s*, nộp phiếu trả giá\s*)?:\s*(.+?)\s+(tại|trên)\b/i);
        regex = /Từ (\d{1,2})h(\d{2})[’']?\s+ngày\s+(\d{1,2})\/(\d{1,2})\/(\d{4}) đến (\d{1,2})h(\d{2})[’']?\s+ngày\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        let aucRegTime=''
        if(aucRegTimeFull){
            aucRegTime = aucRegTimeFull[1].match(regex);
        }
        if (aucRegTime) {
            const startHour = aucRegTime[1].padStart(2, '0');
            const startMinute = aucRegTime[2].padStart(2, '0');
            const startDay = aucRegTime[3].padStart(2, '0');
            const startMonth = aucRegTime[4].padStart(2, '0');
            const startYear = aucRegTime[5];
          
            const endHour = aucRegTime[6].padStart(2, '0');
            const endMinute = aucRegTime[7].padStart(2, '0');
            const endDay = aucRegTime[8].padStart(2, '0');
            const endMonth = aucRegTime[9].padStart(2, '0');
            const endYear = aucRegTime[10];
          
            const start = `${startDay}/${startMonth}/${startYear} ${startHour}:${startMinute}`;
            const end = `${endDay}/${endMonth}/${endYear} ${endHour}:${endMinute}`;
          
            this.setState({
                aucRegTimeStart:start,
                aucRegTimeEnd:end
            })
        } else {
        console.log("Không tìm thấy thời gian");
        }

        
        //Địa điểm điều kiện, cách thức đăng ký
        let aucCondition = this.state.fileContent.match(/Điều kiện(?:\s*, cách thức đăng ký\s*)?(?:\s*khách hàng\s*)?tham gia đấu giá:\s*(.+?)\./i);
        if (aucCondition && aucCondition[1]) {
            // console.log("Địa điểm, điều kiện, cách thức đấu giá là:", aucCondition[1]);
            this.setState({
                aucCondition:aucCondition[1]
            })
        } else {
            console.log("Không tìm thấy địa điểm, điều kiện, cách thức đấu giá.");
        }
        

        //Thời gian, địa điểm xem tài sản
        
        let propertyViewLocation = this.state.fileContent.match(/(?<=[-+•\d.\s]*(?:Thời gian, địa điểm\s*)?xem tài sản:\s*\n?)([\s\S]*?)(?=[-+•\d.\s]*Nộp tiền đặt trước:)/i);
        if(propertyViewLocation){
            // console.log('propertyViewLocation:',propertyViewLocation[0])
            this.setState({
                propertyViewLocation:propertyViewLocation[0].trim()
            })
            //Địa điểm xem tài sản
            let propertyPlace = propertyViewLocation[0].match(/tại[^\n\r]*/i)
            if(propertyPlace){
                // console.log(propertyPlace[0])
                this.setState({
                    propertyPlace:propertyPlace[0]
                })
            }
        }
        //Thời gian, địa điểm bán hồ sơ
        let fileSellLocation=this.state.fileContent.match(/[-+•\d.\s]*Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá(?:\s*, nộp phiếu trả giá\s*)?:\s*([\s\S]*?)(?=\n[-+•\d.\s]*Thời gian, địa điểm xem tài sản)/i);
            //Trường hợp chỉ có từ "Xem tài sản" VD: Khoản nợ HS 124 
        if(!fileSellLocation){
            fileSellLocation = this.state.fileContent.match(/[-+•\d.\s]*Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá(?:\s*, nộp phiếu trả giá\s*)?:\s*([\s\S]*?)(?=\n[-+•\d.\s]*Xem tài sản)/i);
            console.log(fileSellLocation)
        }
        if(fileSellLocation){
            // console.log('Thời gian, địa điểm bán hồ sơ: ',fileSellLocation[1])
            this.setState({
                fileSellLocation:fileSellLocation[1]
            })
        }else{
            console.log('Không tìm thấy thời gian, địa điểm bán hồ sơ')
        }


        /////////////////////////////////////////////Thêm tài sản ///////////////////////////////////////////////
        //Tên tài sản
        let propertyName = this.state.fileContent.match(/(?:- |\d+\.\s*)?(?:Tên\s*)?tài sản đấu giá(?:\s*là\s*)?:\s*([\s\S]*?)(?=\n[-\d]+\.\s*(?:Tổng\s*)?Giá khởi điểm:|\n-?\s*Giá khởi điểm:)/i);
        if(!propertyName){
            propertyName = this.state.fileContent.match(/(?:^|\n)\s*\d+\.\s*Tên\s+tài\s+sản\s+đấu\s+giá:\s*([\s\S]*?)(?=\n\s*\d+\.\s*Giá\s+khởi\s+điểm:)/i);
        }
        if (propertyName && propertyName[1]) {
            // console.log("Tài sản đấu giá:", propertyName[1]);
            this.setState({
                propertyName:propertyName[1]
            })
        } else {
        console.log("Không tìm thấy tài sản đấu giá.");
        }

        //Địa điểm xem tài sản/ Nơi có tài sản
        let propertyVie = this.state.fileContent.match(/(?:- |\d+\.\s*)?(?:Tên\s*)?Tài sản đấu giá:\s*([\s\S]*?)(?=\n[-\d]+\.\s*Giá khởi điểm:|\n-?\s*Giá khởi điểm:)/i);
        if (propertyName && propertyName[1]) {
            // console.log("Tài sản đấu giá:", propertyName[1]);
            this.setState({
                propertyName:propertyName[1]
            })
        } else {
        console.log("Không tìm thấy tài sản đấu giá.");
        }
        


        //Giá khởi điểm
        let starting_Price = this.state.fileContent.match(/Giá khởi điểm:\s*([\d\.]+)\s*đồng/i);
        if (starting_Price && starting_Price[1]) {
            // console.log("Giá khởi điểm là:", starting_Price[1]);
            this.setState({
                propertyStartPrice:starting_Price[1]
            })
        } else {
        console.log("Không tìm thấy giá khởi điểm.");
        }
        //Đơn vị đặt cọc
        this.setState({
            depositUnit:0
        })
        //Tiền đặt trước
        let deposit = this.state.fileContent.match(/Tiền đặt trước:\s*([\d\.]+)\s*đồng/i);
        if (deposit && deposit[1]) {
            // console.log("Tiền đặt trước là:", deposit[1]);
            this.setState({
                deposit:deposit[1]
            })
        } else {
        console.log("Không tìm thấy tiền đặt trước.");
        }

        //Tiền mua hồ sơ
        let fileCost = this.state.fileContent.match(/Tiền mua hồ sơ mời tham gia đấu giá:\s*([\d\.]+)\s*đồng/i);
        if (fileCost && fileCost[1]) {
            // console.log("Tiền mua hồ sơ là:", fileCost[1]);
            this.setState({
                fileCost:fileCost[1]
            })
        } else {
        console.log("Không tìm thấy tiền mua hồ sơ.");
        }
        

        
        
        

        

       
    }
    
    render() {
        
        // console.log('states: ',this.state)
        
        return (
            <div className='container'>
                <div className='content'>
                    <div className='compare-top-content'>
                        

                        <div>
                            <label>Thông báo đấu giá: </label>
                            <input type="file"onChange={this.handleFileChange} />
                        </div>
                    </div>
                    
                    <div className='compare-bottom-content'>
                        {this.state.fileContent&&
                        <>
                        <button className='handle-compare-btn' onClick={()=>this.handleCompare()}>Tạo tài sản</button>
                        <button className='handle-compare-btn' onClick={()=>this.handleGetText()}>Lấy dữ liệu text</button>
                        </>
                        }
                    </div>
                        

                    {this.state.fileContent&&
                        <>
                        <h3>Thông báo:</h3>
                        <pre className='file-content'>{this.state.fileContent}</pre>
                        
                        </>
                    }
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
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DgtsTool);
