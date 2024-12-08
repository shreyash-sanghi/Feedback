import axios from "axios";
const BASE_URL = `https://feedback-backend-zeta.vercel.app`
// const BASE_URL = `http://localhost:7000`

const AxiosApi = axios.create({
baseURL:BASE_URL,
timeout:5000,
headers:{
    'Authorization': localStorage.getItem("token"),
    'Content-Type': 'application/json'
}
})

export default AxiosApi;

