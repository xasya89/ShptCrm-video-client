import axios from 'axios';
export const API_URL = process.env.REACT_APP_SERVER_API;

const $api = axios.create({
    baseURL: API_URL
})

export default $api;