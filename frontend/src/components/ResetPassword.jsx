import React, { useState } from 'react'
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
function ResetPassword() {
    const {id,token} = useParams();
    const navigate = useNavigate();
    const [CPassword,setCPassword] = useState("");
    const [Password,setNewPassword] = useState("");

    const save =async()=>{
        try {
            if(Password != CPassword){
                alert("Both Password are diffrent...");
            }
            else{
                axios.defaults.headers.common["Authorization"] = token;
                await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/update_password/${id}`,{
                   Password
                   })
                   navigate("/login_dashboard")
            }
        } catch (error) {
            alert(error);
        }
    }
  return (
    <div>
      <div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
  <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
    <div class="mx-auto flex w-full max-w-md flex-col space-y-16">
      <div class="flex flex-col items-center justify-center text-center space-y-2">
        <div class="font-semibold text-3xl">
          <p>Reset Password</p>
        </div>
 
      </div>

        <div  method="post">
          <div class="flex flex-col space-y-5">
            
            <div class="flex flex-col items-center justify-between mx-auto w-full ">
              <div class="w-full h-16 ">
                <label className='my-2 font-bold'>New Password</label>
                {/* <input type="password" onChange={(e)=>setCode(e.target.value)} class="w-full h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/> */}
                <input placeholder='*****' type="password" onChange={(e)=>setNewPassword(e.target.value)} class="w-full mt-y h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
              </div>
              <div class="w-full mt-10 h-16  ">
                <label className='my-2 font-bold '>Confirm Password</label>
                {/* <input type="password" onChange={(e)=>setCode(e.target.value)} class="w-full h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/> */}
                <input placeholder='********' type="password" onChange={(e)=>setCPassword(e.target.value)} class="w-full mt-y h-[80%] flex flex-col items-center justify-center  px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" name="" id=""/>
              </div>
            </div>
            <div class="flex flex-col space-y-5">
              <div>
                <button onClick={save} class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                 Save Password
                </button>
              </div>    
            </div>
          </div>
        </div>

    </div>
  </div>
</div>
    </div>
  )
}

export default ResetPassword
