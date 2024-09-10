import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
export default function AdminVerify() {
  const navigate = useNavigate();
const [code,setCode] = useState("");
const [myemail,setEmail] = useState("");
const [videoOpen, setPopOpen] = useState(false);

const verifyotp = async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/verify_key`,{
          key:code,Email:myemail
        })
        const token = response.data.Token;
        const OwnerEmail = response.data.OwnerEmail;
        axios.defaults.headers.common["Authorization"] = token;
          sessionStorage.setItem('token', token);
         if(OwnerEmail == myemail){
           navigate(`/admin_dashboard`)
          }
          else{
           navigate(`/staf_dashboard`)
         }
    } catch (error) {
      alert(error.response.data.error)
        // alert("Please Enter valid Code...")
        // alert(error)
    }
}
const sendPasswordResetLink = async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/send_pasword_reset_link`,{
          Email:myemail
        })
        alert("Password Update Link have been send to your WhatsApp ")
        setPopOpen(false);
    } catch (error) {
        // alert("Please Enter valid Code...")
        alert(error)
    }
}
  return (
    <div>
      <div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
  <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
    <div class="mx-auto flex w-full max-w-md flex-col space-y-16">
      <div class="flex flex-col items-center justify-center text-center space-y-2">
        <div class="font-semibold text-3xl">
          <p>Staf Login Form</p>
        </div>
 
      </div>

        <div  method="post">
          <div class="flex flex-col space-y-5">
            
            <div class="flex flex-col items-center justify-between mx-auto w-full ">
              <div class="w-full h-16 ">
                <label className='my-2 font-bold'>Email</label>
                {/* <input type="password" onChange={(e)=>setCode(e.target.value)} class="w-full h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/> */}
                <input placeholder='abc@gmail.com' type="email" onChange={(e)=>setEmail(e.target.value)} class="w-full mt-y h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
              </div>
              <div class="w-full mt-10 h-16  ">
                <label className='my-2 font-bold '>Code</label>
                {/* <input type="password" onChange={(e)=>setCode(e.target.value)} class="w-full h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/> */}
                <input placeholder='********' type="password" onChange={(e)=>setCode(e.target.value)} class="w-full mt-y h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
              </div>
            </div>
          <button onClick={()=>setPopOpen(true)} className='flex text-red-600'>Forgot Code ?</button>
            <div class="flex flex-col space-y-5">
              <div>
                <button onClick={verifyotp} class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                  Verify 
                </button>
              </div>    
            </div>
          </div>
        </div>

    </div>
  </div>
</div>
      {videoOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black bg-opacity-70">
          <div className="mx-auto w-full max-w-[550px] rounded-lg min-h-[40vh] bg-white">
            <>
            <div className='flex justify-between mx-auto w-full align-middle items-center '>

            <h1 className='flex font-bold text-2xl my-3 mx-auto '>Reset Code</h1>
            </div>
            <div class="flex flex-col  justify-between mx-auto w-[80%] ">
 
                <label className='my-2  font-bold'>Email</label>
                <input value={myemail} placeholder='abc@gmail.com' type="email" onChange={(e)=>setEmail(e.target.value)} class="w-full mt-y h-16 border-black flex flex-col items-center justify-center  px-5 outline-none rounded-xl border mb-5 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
                <button onClick={sendPasswordResetLink} class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                  Verify 
                </button>
            </div>
 <div class="flex flex-col space-y-5 w-[80%]">
              <div>
          
              </div>    
            </div>

            </>
          </div>

          <button
            onClick={() => setPopOpen(false)}
            className="absolute right-0 top-0 flex h-20 w-20 cursor-pointer items-center justify-center text-body-color "
          >
            <svg viewBox="0 0 16 15" className="h-8 w-8 fill-current">
              <path d="M3.37258 1.27L8.23258 6.13L13.0726 1.29C13.1574 1.19972 13.2596 1.12749 13.373 1.07766C13.4864 1.02783 13.6087 1.00141 13.7326 1C13.9978 1 14.2522 1.10536 14.4397 1.29289C14.6272 1.48043 14.7326 1.73478 14.7326 2C14.7349 2.1226 14.7122 2.24439 14.6657 2.35788C14.6193 2.47138 14.5502 2.57419 14.4626 2.66L9.57258 7.5L14.4626 12.39C14.6274 12.5512 14.724 12.7696 14.7326 13C14.7326 13.2652 14.6272 13.5196 14.4397 13.7071C14.2522 13.8946 13.9978 14 13.7326 14C13.6051 14.0053 13.478 13.984 13.3592 13.9375C13.2404 13.8911 13.1326 13.8204 13.0426 13.73L8.23258 8.87L3.38258 13.72C3.29809 13.8073 3.19715 13.8769 3.08559 13.925C2.97402 13.9731 2.85405 13.9986 2.73258 14C2.46737 14 2.21301 13.8946 2.02548 13.7071C1.83794 13.5196 1.73258 13.2652 1.73258 13C1.73025 12.8774 1.753 12.7556 1.79943 12.6421C1.84586 12.5286 1.91499 12.4258 2.00258 12.34L6.89258 7.5L2.00258 2.61C1.83777 2.44876 1.74112 2.23041 1.73258 2C1.73258 1.73478 1.83794 1.48043 2.02548 1.29289C2.21301 1.10536 2.46737 1 2.73258 1C2.97258 1.003 3.20258 1.1 3.37258 1.27Z" />
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}
