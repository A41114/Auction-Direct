import React, { Component,useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { property } from 'lodash';
import  { useRef } from 'react';
import domtoimage from 'dom-to-image';
import { getAuctionAnnouncement,createNewRecruitment } from '../services/userService';
import './Home.scss'
import { REGISTER } from 'redux-persist';


class Home extends Component {
    
    constructor(props) {
        super(props);
        
        this.state={
            fileContent: '',
            auctionAnnoucement:'',
            url:'',
            selectedFile: '',
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
                url:this.state.url,
                formData:formData
            })
            let [deposit_Start_Date, deposit_Start_Time] = auctionAnnoucement.res.register_Deposit_Start.split(" ");
            let [deposit_End_Date, deposit_End_Time] = auctionAnnoucement.res.register_Deposit_End.split(" ");
            
            let [bidding_Start_Date, bidding_Start_Time] = auctionAnnoucement.res.start_bidding.split(" ");
            let [bidding_End_Date, bidding_End_Time] = auctionAnnoucement.res.end_bidding.split(" ");
            // console.log('date: ',deposit_Start_Date)
            // console.log('time: ',this.formatTime(deposit_Start_Time))
            this.setState({
                auctionAnnoucement:auctionAnnoucement.res,

                register_Start_End:'Thời gian, địa điểm bán hồ sơ mời tham gia đấu giá, tiếp nhận hồ sơ tham gia đấu giá: Từ '+this.formatTime(deposit_Start_Time)+
                ' ngày '+this.formatDate(deposit_Start_Date)+' đến '+this.formatTime(deposit_End_Time)+' ngày '+this.formatDate(deposit_End_Date),
                deposit_Start_End:'Nộp tiền đặt trước: Từ '+this.formatTime(deposit_Start_Time)+' ngày '+this.formatDate(deposit_Start_Date)+' đến '+this.formatTime(deposit_End_Time)+' ngày '+this.formatDate(deposit_End_Date),
                starting_Price:'Giá khởi điểm: '+auctionAnnoucement.res.starting_price.replaceAll(",", "."),
                step:'Bước giá: '+auctionAnnoucement.res.step.replaceAll(",", "."),
                fee:'Tiền mua hồ sơ mời tham gia đấu giá: '+auctionAnnoucement.res.fee.replaceAll(",", "."),
                owner:auctionAnnoucement.res.owner,
                place:auctionAnnoucement.res.place,
                checking_Property:'tài sản: '+auctionAnnoucement.res.checkProperty,
                deposit:'Tiền đặt trước: '+auctionAnnoucement.res.deposit.replaceAll(",", "."),
                bidding_Start_End:'- Thời gian: '+this.formatTime2(bidding_Start_Time)+' đến '+this.formatTime2(bidding_End_Time)+' ngày '+this.formatDate(bidding_Start_Date),
            })
        } catch (e) {
            console.log(e)
        }
    }
     
    
    handleCompare=()=>{
        this.getData()

    }
    // componentDidUpdate(prevProps, prevState) {
    //     // // So sánh trạng thái và thuộc tính hiện tại với trước đó
    //     // if (this.state.auctionAnnoucement !== prevState.auctionAnnoucement) {
    //     //     // Thực hiện một số hành động khi state thay đổi
    //     //     console.log('State đã thay đổi!');
    //     // }
    // }
    
    render() {
        
        console.log('states: ',this.state)
        
        return (
            <div className='container'>
                <div className='content'>
                    <div className='top-content'>
                        <div className='logo'></div>
                        <div className='title'>Công ty Đấu giá hợp danh VNA</div>
                    </div>
                    <div className='mid-content'>
                        <div className='mid-content-item homepage'>Trang chủ</div>
                        <div className='mid-content-item intro'>Giới thiệu</div>
                        <div className='mid-content-item auction-annoucement'>Thông báo công khai việc đấu giá</div>
                        <div className='mid-content-item choosing-annoucement'>Thông báo lựa chọn tổ chức đấu giá</div>
                        <div className='mid-content-item database'>Cơ sở dữ liệu</div>
                        <div className='mid-content-item news'>Tin tức</div>
                        <div className='mid-content-item blank'></div>
                    </div>
                    <div className='bottom-content'></div>
                    <div className='compare-top-content'>
                        <div>
                        <label>Link tài sản: </label>
                        <input type="text" onChange={(event)=>this.handleOnChangeInput(event,'url')} />
                        </div>

                        <div>
                            <input type="file"onChange={this.handleFileChange} />
                        </div>
                    </div>
                    
                    <div className='compare-bottom-content'>
                        {this.state.fileContent&&this.state.url&&
                        <>
                        <button className='handle-compare-btn' onClick={()=>this.handleCompare()}>Kiểm tra</button>
                        </>
                        }
                        
                    </div>
                    
                        
                        <div className='compare-content'>
                            {this.state.register_Start_End&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.register_Start_End)?'compare-item-title correct':'compare-item-title'}>Thời gian mở - Kết thúc đăng ký: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.register_Deposit_Start}-{this.state.auctionAnnoucement.register_Deposit_End}</div>
                                <div className='text-content'>{this.state.register_Start_End}</div>
                            </div>
                            }
                            {this.state.starting_Price&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.starting_Price)?'compare-item-title correct':'compare-item-title'}>Giá khởi điểm: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.starting_price}</div>
                                <div>{this.state.starting_Price}</div>
                            </div>
                            }
                            {this.state.step&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.step)?'compare-item-title correct':'compare-item-title'}>Bước giá: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.step}</div>
                                <div>{this.state.step}</div>
                            </div>
                            }
                            {this.state.fee&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.fee)?'compare-item-title correct':'compare-item-title'}>Phí tham gia đấu giá: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.fee}</div>
                                <div>{this.state.fee}</div>
                            </div>
                            }
                            {this.state.owner&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.owner)?'compare-item-title correct':'compare-item-title'}>Chủ tài sản: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.owner}</div>
                                <div>{this.state.owner}</div>
                            </div>
                            }
                            {this.state.place&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.place)?'compare-item-title correct':'compare-item-title'}>Nơi xem tài sản: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.place}</div>
                                <div>{this.state.place}</div>
                            </div>
                            }
                            {this.state.checking_Property&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.checking_Property)?'compare-item-title correct':'compare-item-title'}>Thời gian xem tài sản: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.checkProperty}</div>
                                <div>{this.state.checking_Property}</div>
                            </div>
                            }
                            {this.state.bidding_Start_End&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.bidding_Start_End)?'compare-item-title correct':'compare-item-title'}>Thời gian đấu giá: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.start_bidding}-{this.state.auctionAnnoucement.end_bidding}</div>
                                <div>{this.state.bidding_Start_End}</div>
                            </div>
                            }
                            {this.state.deposit&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.deposit)?'compare-item-title correct':'compare-item-title'}>Tiền đặt trước: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.deposit}</div>
                                <div>{this.state.deposit}</div>
                            </div>
                            }
                            {this.state.deposit_Start_End&&
                            <div className='compare-item'>
                                <div className={this.handleSearch(this.state.deposit_Start_End)?'compare-item-title correct':'compare-item-title'}>Thời gian bắt đầu - kết thúc nộp tiền đặt trước: </div>
                                <div className='web-content'>{this.state.auctionAnnoucement.register_Deposit_Start}-{this.state.auctionAnnoucement.register_Deposit_End}</div>
                                <div>{this.state.deposit_Start_End}</div>
                            </div>
                            }
                        </div>
                        

                    {this.state.fileContent&&
                        <>
                        <h3>Nội dung file:</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
