import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,createNewRecruitment } from '../services/userService';
import './VnaPartnerTool.scss'
import { REGISTER } from 'redux-persist';
import { type } from '@testing-library/user-event/dist/type';


class VnaPartnerTool extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            status:'edit',

            fileContent: '',
            url:'https://dgts.moj.gov.vn/login',
            fileContent: "",
            planContent:"",
            rulesContent:"",
            rules_num:"",
            secretary:'',
            auctioneer:'',


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
            shortPropertyName:'',
            isCar:'',
            propertyPlace:'',
            propertyViewTime:'',
            propertyStartPrice:'',
            depositUnit:'',
            deposit:'',
            fileCost:'',
            step:'',
            bank:'',
            onePersonAllowed:'Cho phép',

            HDDGDV:''
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

    handlePlanChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
          this.setState({ planContent: e.target.result });
        };
    
        reader.readAsText(file);
    };

    handleRulesChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            let rules_num=e.target.result.match(/Quyết định số (\d+)\.\d+\/\d+/);
            // console.log('Quy chế số: ',rules_num[1])  
          this.setState({ rulesContent: e.target.result,
            rules_num:rules_num[1]
           });
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
                url:this.state.url,
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
                shortPropertyName: this.state.shortPropertyName,
                isCar:this.state.isCar,
                propertyPlace:this.state.propertyPlace,
                propertyViewTime:this.state.propertyViewTime,
                propertyStartPrice:this.state.propertyStartPrice,
                depositUnit:this.state.depositUnit,
                deposit:this.state.deposit,
                fileCost:this.state.fileCost,
                step:this.state.step,
                bank: this.state.bank,
                secretary:this.state.secretary,
                onePersonAllowed:this.state.onePersonAllowed,
                rulesContent:this.state.rulesContent,
                rules_num:this.state.rules_num,
                auctioneer: this.state.auctioneer,

                type:'VnaPartner',
                status:this.state.status,
                HDDGDV:this.state.HDDGDV

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
        let owner_Address = this.state.fileContent.match(/Đơn vị có tài sản:.*?Địa chỉ:\s*(.+?)\./i);
        if (owner_Address && owner_Address) {
            // console.log("Địa chỉ người có tài sản là:", owner_Address[1]);
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
            if(auction_Type[1].includes('bằng lời nói')){
                await this.setState({
                    aucType:1
                })
            }else if(auction_Type[1].includes('trực tiếp')){
                await this.setState({
                    aucType:2
                })
            }else if(auction_Type[1].includes('gián tiếp')){
                await this.setState({
                    aucType:3
                })
            }else if(auction_Type[1].includes('trực tuyến')){
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


        //Thời gian đăng ký/đặt cọc theo đăng ký
        let aucRegTimeFull = this.state.fileContent.match(/Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá:\s*(.+?)\s+(tại|trên)\b/i);
        regex = /Từ (\d{1,2})h(\d{2})[’']?\s+ngày\s+(\d{1,2})\/(\d{1,2})\/(\d{4}) đến (\d{1,2})h(\d{2})[’']?\s+ngày\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        let aucRegTime = aucRegTimeFull[1].match(regex);
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
        let aucCondition = this.state.fileContent.match(/Điều kiện, cách thức đăng ký tham gia đấu giá:\s*(.+?)\./i);
        if (aucCondition && aucCondition[1]) {
            // console.log("Địa điểm, điều kiện, cách thức đấu giá là:", aucCondition[1]);
            this.setState({
                aucCondition:aucCondition[1]
            })
        } else {
            console.log("Không tìm thấy địa điểm, điều kiện, cách thức đấu giá.");
        }
        

        //Thời gian, địa điểm xem tài sản
        
        let propertyViewLocation = this.state.fileContent.match(/(?<=[-+•\d.\s]*(?:Thời gian, địa điểm\s*)?xem tài sản:\s*(?:\n)?)([\s\S]*?)(?=[-+•\d.\s]*Nộp tiền đặt trước:)/i);
        // console.log('propertyViewLocation:',propertyViewLocation)
        if(propertyViewLocation){
            this.setState({
                propertyViewLocation:propertyViewLocation[0].trim()
            })
            //Địa điểm xem tài sản
            let propertyPlace 
            let propertyPlaceFix
            // propertyPlace = propertyViewLocation[0].match(/tại[^\n\r]*/i)
            if(propertyViewLocation[0].includes('Nơi lưu giữ tài sản')){
                propertyPlace = propertyViewLocation[0].match(/tại[^\n\r]*/i)
                //lấy phần địa chỉ bỏ vào propertyPlaceFix
                propertyPlaceFix = propertyPlace[0].match(/Địa chỉ:\s*(.*)/i)
            }else{
                // Tìm "tại:" và xem sau nó có xuống dòng không
                // let taiMatch = propertyViewLocation[0].trim().match(/tại:\s*([\s\S]*)/i);
                let taiMatch = propertyViewLocation[0].trim().match(/tại:\s*(\n)?/i);
                console.log('taiMatch: ',taiMatch)
                if (taiMatch) {
                    const afterTai = taiMatch[0];

                    if (afterTai.match(/\r?\n/)) {
                        // console.log('Có')
                      // Nếu sau "tại:" có xuống dòng → lấy tất cả sau "tại:"
                        propertyPlace = propertyViewLocation[0].trim().match(/tại([\s\S]*?)*/i)
                        propertyPlaceFix=[]
                        propertyPlaceFix[1]=propertyPlace[0]
                    }else{
                        // console.log('Không')
                        propertyPlace = propertyViewLocation[0].match(/tại[^\n\r]*/i)
                        //lấy phần địa chỉ bỏ vào propertyPlaceFix
                        propertyPlaceFix = propertyPlace[0].match(/Địa chỉ:\s*(.*)/i)
                    }
                }

            }
            
            if(propertyPlaceFix){
                console.log(propertyPlaceFix)
                this.setState({
                    propertyPlace:propertyPlaceFix[1]
                })
            }
            //Thời gian xem tài sản
            // let propertyViewTime = propertyViewLocation[0].match(/Thời gian xem tài sản:?\s*(.*?)\s+tại/i)
            let propertyViewTime=''
            if(propertyViewLocation[0].trim().includes('Thời gian xem tài sản')){
                propertyViewTime = propertyViewLocation[0].trim().match(/[-+•\d.\s]*Thời gian xem tài sản:\s*([\s\S]*?)tại/i)
            }else{
                propertyViewTime = propertyViewLocation[0].trim().match(/([\s\S]*?)tại/i)
            }
            if(propertyViewTime){
                // console.log(propertyPlace[0])
                this.setState({
                    propertyViewTime:propertyViewTime[1]
                })
            }
        }
        //Thời gian, địa điểm bán hồ sơ
        let fileSellLocation=this.state.fileContent.match(/[-+•\d.\s]*Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá:\s*([\s\S]*?)(?=\n[-+•\d.\s]*(?:Thời gian, địa điểm\s*)?xem tài sản)/i);
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
            //Tên tài sản rút gọn
            let shortPropertyName = propertyName[1].match(/^.*$/m)
            if(shortPropertyName){
                // console.log(shortPropertyName)
                this.setState({
                    shortPropertyName:shortPropertyName[0]
                })
            }
            if(propertyName[1].toLowerCase().includes('ô tô')){
                this.setState({
                    isCar:true
                })
            }else{
                this.setState({
                    isCar:false
                })
            }
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
        //Bước giá
        let step = this.state.fileContent.match(/Bước giá:\s*([\d\.]+)\s*đồng/i);
        if (step && step[1]) {
            // console.log("Tiền đặt trước là:", deposit[1]);
            this.setState({
                step:step[1]
            })
        } else {
        console.log("Không tìm thấy bước giá.");
        }
        //Tài khoản ngân hàng
        let bank=''
        //ICB
        if(this.state.fileContent.includes(110601631555)){
            bank = 110601631555
        //ICB
        }else if(this.state.fileContent.includes(112609055555)){
            bank = 112609055555
        //TK chính    
        }else if(this.state.fileContent.includes(115644399999)){
            bank='Tài khoản chính'
        //BIDV Long Biên (có 2 số)
        }else if(this.state.fileContent.includes(1500678622)||this.state.fileContent.includes(15010000678622)){
            bank = 1500678622
        //VPB
        }else if(this.state.fileContent.includes(9015599)){
            bank = 9015599
        //BIDV Lạch Tray
        }else if(this.state.fileContent.includes(3280830162)){
            bank = 3280830162
        }else if(this.state.fileContent.includes(8630058758)){
            bank = 8630058758
        }else if(this.state.fileContent.includes(8688222222)){
            bank = 8688222222
        }
        this.setState({
            bank:bank
        })
        
        //Hợp đồng đấu giá dịch vụ số ([\s\S]*?)
        let HDDGDV = this.state.planContent.match(/Thực hiện Hợp đồng dịch vụ đấu giá tài sản số \s*(.+?)Công ty Đấu giá hợp danh VNA/i);
        // let HDDGDV = this.state.planContent.match(/Thực hiện[^,]*/i);
        // console.log('HĐĐGDV: ',HDDGDV)
        if(HDDGDV){
            this.setState({
                HDDGDV: HDDGDV[0]
            })
        }else{
            console.log("Không tìm số hợp đồng dịch vụ đấu giá");
        }

        

       
    }
    handleChangeStatus=(stt)=>{
        this.setState({
            status:stt
        })
    }
    
    render() {
        
        console.log('VnaPartnerTool states: ',this.state)
        
        return (
            <div className='container'>
                <div className='content'>
                    <div className='compare-top-content'>
                        <div className='secretary-container'>
                            <label>Tên thư ký: </label>
                            <input className='secretary-name' type="text" onChange={(event)=>this.handleOnChangeInput(event,'secretary')} />
                            
                        </div>
                        <div className='auctioneer-container'>
                            <label>Đấu giá viên: </label>
                            <input className='auctioneer-name' type="text" onChange={(event)=>this.handleOnChangeInput(event,'auctioneer')} />
                        </div>
                        
                        <div>
                            <label>Đấu giá 1 người: </label>
                            <select className='form-control'
                            onChange={(event)=>this.handleOnChangeInput(event,'onePersonAllowed')}
                            >   
                                <option>Cho phép</option>
                                <option>Không cho phép</option>
                            
                            </select>
                        </div>
                        <div>
                            <label>Thông báo: </label>
                            <input type="file"onChange={this.handleFileChange} />
                        </div>
                        <div className='plan'>
                            <label>Kế hoạch: </label>
                            <input type="file"onChange={this.handlePlanChange} />
                        </div>
                        <div className='rules'>
                            <label>Quy chế: </label>
                            <input type="file"onChange={this.handleRulesChange} />
                        </div>
                        
                        
                        
                    </div>
                    
                    
                    
                    
                    <div className='compare-bottom-content'>
                        {this.state.fileContent&&
                        <>
                        {this.state.status==='create'?
                            <button className='handle-status-create' onClick={()=>this.handleChangeStatus('edit')}>Trạng thái: Tạo</button>:
                            <button className='handle-status-edit' onClick={()=>this.handleChangeStatus('create')}>Trạng thái: Sửa</button>
                        }
                        
                        
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
                    {this.state.planContent&&
                        <>
                        <h3>Kế hoạch:</h3>
                        <pre className='file-content'>{this.state.planContent}</pre>
                        
                        </>
                    }

                    {this.state.rulesContent&&
                        <>
                        <h3>Quy chế:</h3>
                        <pre className='file-content'>{this.state.rulesContent}</pre>
                        
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

export default connect(mapStateToProps, mapDispatchToProps)(VnaPartnerTool);
