// ChatBox.js
import React, { Component } from 'react';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import { chatboxStart,getMessagesByChatboxId,sendMessage, getAllAdminChatboxByAdminId } from './services/userService';
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      chat_room_id:'',
      messages: [],
      isConnected: false,
      allChatbox:[],
      numberOfChatbox:'',
      messagesByTab:{},
      activeTabId:''
    };

    // ⚡ Khởi tạo kết nối socket
    // this.socket = io('http://localhost:8080',{
    //   withCredentials: true,
    //   transports: ['websocket']
    // }); // đúng với cổng server socket
    this.socket = null; // chưa kết nối
  }

  async componentDidMount() {
    if(this.props.userInfo){
      if(this.props.userInfo.roleId==='Admin'){
        let allChatbox = await getAllAdminChatboxByAdminId(this.props.userInfo.id)
        this.setState({
          allChatbox: allChatbox.chat,
          numberOfChatbox : allChatbox.chat.length
        })
        this.handleChatboxStart()
      }
    }
    
  
  }

  componentWillUnmount() {
    // Ngắt kết nối khi component unmount
    // this.socket.disconnect();
    if (this.socket) {
      this.socket.disconnect();
      console.log('🛑 Socket disconnected on unmount');
    }
  }

  handleSend = async() => {
    // const { message } = this.state;
    if(this.props.userInfo.id){
      //If admin dùng messagesByTab
      this.socket.emit('send_message', {
        chat_room_id: this.state.chat_room_id,  
        sender_id: this.props.userInfo.id,
        sender_role: this.props.userInfo.roleId,
        message: this.state.message,
      });
      // this.socket.emit('send_message', this.state.chat_room_id);
      let res_sendMessage = await sendMessage({
        chat_room_id: this.state.chat_room_id,
        sender_id: this.props.userInfo.id,
        sender_role: this.props.userInfo.roleId,
        message: this.state.message,
      })
      // this.socket.on('new_message', (msg) => {
      //   this.setState((prev) => ({
      //     messages: [...prev.messages, msg],
      //   }));
      // });
      this.setState({
        message:''
      })
      console.log('messagesByTab 6: ',this.state.messagesByTab[6])
    }
  };
  handleChatboxStart=async()=>{
    if(this.props.userInfo.id){
      

      // Gọi API tạo phòng
      let res = await chatboxStart({
        customer_id: this.props.userInfo.id,
        admin_id: 19,
      });
      
      this.setState({ chat_room_id: res.chat.id}, () => {
        // Tạo kết nối socket sau khi setState xong
        this.socket = io('http://localhost:8080', {
          transports: ['websocket'],
          withCredentials: true,
        });
    
        // Khi kết nối thành công
        this.socket.on('connect', async() => {
          // console.log('✅ Socket connected:', this.socket.id);
          this.setState({ isConnected: true });
    
          // Tham gia phòng
          if(this.props.userInfo.roleId==='Admin'){
            let messageArr={}
            for(let i=0; i<this.state.numberOfChatbox;i++){
              // Gọi API lấy tin nhắn
              let res_getMessagesByChatboxId = await getMessagesByChatboxId(this.state.allChatbox[i].id)
              messageArr[this.state.allChatbox[i].id]=res_getMessagesByChatboxId.messages
            }
            this.setState({
              messagesByTab:messageArr
            })
            // 👉 Gọi API để lấy lắng nghe tin vừa nhắn
            this.socket.on('new_message_multi', (msg) => {
              const roomId = this.state.chat_room_id;
              this.setState((prev) => ({
                messagesByTab: {
                  ...prev.messagesByTab,
                  [roomId]: [...(prev.messagesByTab[roomId] || []), msg]
                }
              }));
            });
          }else{
            this.socket.emit('join_room', res.chat.id);
            // Gọi API lấy tin nhắn
            let res_getMessagesByChatboxId = await getMessagesByChatboxId(res.chat.id)
            this.setState({
              messages:res_getMessagesByChatboxId.messages
            })
            // 👉 Gọi API để lấy lắng nghe tin vừa nhắn
            this.socket.on('new_message', (msg) => {
              this.setState((prev) => ({
                messages: [...prev.messages, msg],
              }));
            });
          }
          
        });
    
        this.socket.on('connect_error', (err) => {
          console.error('❌ Socket connect error:', err.message);
        });
      });
      
    }
  }
  handleSwitchTab = async (chatRoomId) => {
    let res_getMessagesByChatboxId = await getMessagesByChatboxId(chatRoomId)
    this.setState({ 
      activeTabId: chatRoomId,
      messages : res_getMessagesByChatboxId.messages,
      chat_room_id: chatRoomId
    });
  
    // Nếu chưa có tin nhắn thì gọi API
    // if (!this.state.messagesByTab[chatRoomId]) {
    //   const res = await getMessagesByChatboxId(chatRoomId);
    //   this.setState(prev => ({
    //     messagesByTab: {
    //       ...prev.messagesByTab,
    //       [chatRoomId]: res.messages,
    //     }
    //   }));
    // }
    

    // Tham gia socket room tương ứng
    this.socket = io('http://localhost:8080', {
      transports: ['websocket'],
      withCredentials: true,
    });
    this.socket.on('connect', async() => {
      this.socket.emit('join_room', chatRoomId);
    })
    
  };

  
  
  render() {
    console.log('state: ',this.state)
    return (
      <div>
        {this.props.userInfo&&this.props.userInfo!=='Admin'&&
          <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
            {this.state.messages.map((msg, idx) => (
              <div key={idx}>
                <b>{msg.sender_role}</b>: {msg.message}
              </div>
            ))}
          </div>
        }
        {this.props.userInfo&&this.props.userInfo==='Admin'&&this.state.chat_room_id&&
          <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
            {this.state.messagesByTab[this.state.chat_room_id].map((msg, idx) => (
              <div key={idx}>
                <b>{msg.sender_role}</b>: {msg.message}
              </div>
            ))}
          </div>
        }

        <div className="tabs">
          {this.state.allChatbox.map((item,index)=>{
            // console.log('item: ',item)
            return(
              
                
              <button key={item.id}
              className={this.state.activeTabId === item.id ? 'active' : ''}
              onClick={() => this.handleSwitchTab(item.id)}>
                {item.customer_id}
              </button>

            )
          })}
        </div>

        <input
          type="text"
          value={this.state.message}
          onChange={(e) => this.setState({ message: e.target.value })}
        />
        <button onClick={()=>this.handleSend()}>Gửi</button>
       
          <button onClick={()=>this.handleChatboxStart()}>Mở chatbox</button>
        
      </div>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
// export default ChatBox;

