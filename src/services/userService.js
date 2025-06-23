import { formToJSON } from 'axios'
import axios from '../axios'
const getAuctionAnnouncement = (data,token)=>{
    // console.log('check data from service: ',data)
    // console.log('check token from service: ',token)
    return axios.post('/api/auctionAnnouncement',data,
        {headers:{
            authorization: `Bearer ${token}`,
        }}
    )
}

const createNewCv = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/create-new-cv',data)
}
const getAllCv = (userId)=>{
    return axios.get(`/api/get-all-Cv-by-id?id=${userId}`)
}
const EditCvService = (data)=>{
    // console.log('check data from service', data)
    return axios.put('/api/edit-cv', data)
}

const GetFollowlById = (id)=>{
    // console.log('check GetFollowlById from service', id)
    return axios.get(`/api/get-follow-by-id?id=${id}`)
}
const createNewRecruitment = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/create-new-recruitment',data)
}
const sendMail = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/send-mail',data)
}
const signup = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/signup',data)
}
const login = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/login',data)
}
const chatboxStart = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/chatbox/start',data)
}
const getMessagesByChatboxId = (id)=>{
    // console.log('check data from service', id)
    return axios.get(`/api/get-messages-by-chatbox-id?id=${id}`)
}
const sendMessage = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/messages/send',data)
}
const getAllAdminChatboxByAdminId = (id)=>{
    // console.log('check data from service', data)
    return axios.get(`/api/getAllAdminChatbox-by-admin-id?id=${id}`)
}

export{getAuctionAnnouncement,createNewCv,getAllCv,GetFollowlById,createNewRecruitment,sendMail,signup,login,chatboxStart,getMessagesByChatboxId,sendMessage,
    getAllAdminChatboxByAdminId,
}