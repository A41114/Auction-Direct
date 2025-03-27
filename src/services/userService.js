import { formToJSON } from 'axios'
import axios from '../axios'
const getAuctionAnnouncement = (data)=>{
    console.log('check data from service: ',data)
    return axios.post('/api/auctionAnnouncement',data)
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
    console.log('check data from service', data)
    return axios.post('/api/create-new-recruitment',data)
}

export{getAuctionAnnouncement,createNewCv,getAllCv,GetFollowlById,createNewRecruitment}