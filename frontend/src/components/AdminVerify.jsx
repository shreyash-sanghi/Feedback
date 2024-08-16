import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
export default function AdminVerify() {
  const navigate = useNavigate();
const [code,setCode] = useState("");
const verifyotp = async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/verify_key`,{
          key:code
        })
        const token = response.data.Token;
        axios.defaults.headers.common["Authorization"] = token;
                    // Store the token in sessionStorage instead of localStorage
          sessionStorage.setItem('token', token);
        navigate(`/admin_dashboard`)
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
          <p>Enter Verification Code</p>
        </div>
 
      </div>

      <div>
        <form action="" method="post">
          <div class="flex flex-col space-y-16">
            <div class="flex flex-row items-center justify-between mx-auto w-full ">
              <div class="w-full h-16 ">
                <input type="password" onChange={(e)=>setCode(e.target.value)} class="w-full h-full flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
              </div>
            </div>

            <div class="flex flex-col space-y-5">
              <div>
                <button onClick={verifyotp} class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                  Verify 
                </button>
              </div>    
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}
