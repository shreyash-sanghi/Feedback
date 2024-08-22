import axios from 'axios';
import React, { useEffect, useState } from 'react'
import payclick from "../assets/payclick.webp"
import payclickmobile from "../assets/mobilepay.png"
import { useParams } from 'react-router-dom';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
  } from "@material-tailwind/react";
export default function Home() {
const {id} = useParams();
const token = localStorage.getItem("OneTimeToken");
const [tokdata,set_tok_data] = useState({})
    const [initial,final] = useState({
        Name:"",
        Number:"",
        Rating:"",
        Suggestions:"",
        TeamHelped:"",

    })
    const [iniOTP,setOTP] = useState();
    const [gernateOtp,realOtp] = useState();
    const setdata = (e)=>{
        const {name,value} = e.target;
        final((info)=>{
          if (name === "Number") {
            if(token != null){
              localStorage.removeItem("OneTimeToken");
            }
          }
            return{
                ...info,
                [name] :value
            }
        })
    }

    const savedata = async()=>{
       try {
        const {Name,Number,Rating,TeamHelped, Suggestions} = initial;
        console.log(token);
        if(token === null || token === undefined){
           sendOtp();
        }
        else{ 
        if(Name === ""){
            alert("Please Enter Your Name... ")
            return;
        }
        else if(Number === ""){
            alert("Please Enter Valid Number... ")
            return;
        }
        else if(Rating === ""){
            alert("Please Provide Rating... ")
            return;
        }
        else if(TeamHelped === ""){
            alert("Please fill In what way has my team helped you? ")
            return;
        }
        else{
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let hour = date.getHours();
          let min = date.getMinutes();
      
              let currentDate = `${day}-${month}-${year}`;
              let currentTime= `${hour}:${min}`;
         await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/send_feedback/${id}`,{
            Name,Number,Rating, Suggestions,FeedbackDate:currentDate,TeamHelped,FeedbackTime:currentTime
         })
        alert("Thankyou For You Feedback...")
        window.location.href = 'https://www.payclick.co.in/Web/Default.aspx';
    }
        }
        

       } catch (error) {
        if(error.response.status === 400){

          alert(error.response.data.message)
        }else{
          alert(error)

        }
        // alert("They have some error...")
       }
    }
	      //Pop UP
        const [size, setSize] = React.useState(null);
        const handleOpen = (value) => setSize(value);

             //gernate otp
	 const gernate_otp = ()=>{
    const length =6;
    let otp=""
    for(let i=0;i<length;i++ ){
      otp += Math.floor(Math.random()*10);
    }
    return otp;
}

const sendOtp = async()=>{
  const Number = initial.Number;
  const otp = gernate_otp();
  const response = await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/send_otp`,{
    OTP:otp,Number
  })
  realOtp(otp);
   setTimeout(()=>{
     handleOpen("xxl");
   },2000)
}

const matchOtp = async()=>{
  if(gernateOtp == iniOTP){
          try {
            const {Name,Number,Rating,TeamHelped, Suggestions} = initial;
            const gettoken = await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/get_token`,{
              Number,Name
            });
            const OneTimeToken = localStorage.setItem("OneTimeToken",gettoken.data.token);
            if(Name === ""){
              alert("Please Enter Your Name... ")
              return;
          }
          else if(Number === ""){
              alert("Please Enter Valid Number... ")
              return;
          }
          else if(Rating === ""){
              alert("Please Provide Rating... ")
              return;
          }
          else if(TeamHelped === ""){
              alert("Please fill In what way has my team helped you? ")
              return;
          }
          else{
            const date = new Date();
  
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
                let currentDate = `${day}-${month}-${year}`;
           await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/send_feedback/${id}`,{
              Name,Number,Rating, Suggestions,FeedbackDate:currentDate,TeamHelped
           })
          alert("Thankyou For You Feedback...")
          window.location.href = 'https://www.payclick.co.in/Web/Default.aspx';
      }
    } catch (error) {
      alert("One Time authentication have been failed...")
    }
  }
  else{
    alert("please Enter correct OTP...");
  }
 }

const verifyToken = async()=>{
  try{
    if(token != null){
      axios.defaults.headers.common["Authorization"] = token;
      const check  = await axios.get(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/Check_token`);
      final((prevState) => ({
        ...prevState,
        Name: check.data.response.Name,    
        Number: check.data.response.Number,
      }));
    }}catch(error){
      if(error.request.status === 401){
        localStorage.removeItem("OneTimeToken")
      }else{
        alert(error);
      }
    }
}

 useEffect(()=>{
  verifyToken()
 },[])

  return (
<>
<div class="min-w-screen sm:max-h-screen flex items-center justify-center px-5 py-5">
    <div class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" >
        <div class="lg:flex w-full">
            <div class="hidden  w-[40%] py-2 lg:flex items-center bg-white px-2 opacity-85">
              <img  src={payclickmobile} className=' opacity-100 rounded-xl h-[95vh] min-w-full flex items-center align-middle  justify-center mx-auto '></img>

            </div>
            <div class="w-full md:w-[60%] py-10 px-5 md:px-10">
                <div class="text-center mb-10">
                    <h1 class="font-bold text-3xl text-gray-900">Feedback Form</h1>
                    {/* <p>Enter your information to register</p> */}
                </div>
                <div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <label class="text-xs font-semibold px-1">Name</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input value={initial.Name} onChange={setdata} name='Name' type="text" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John"/>
                            </div>
                        </div>
           
                    </div>
                    <div class="flex -mx-3">
                      
                        <div class="w-full px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">WhatsApp Number</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input value={initial.Number} onChange={setdata} name='Number'   type="number" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="12345678"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Rating for service 0 to 10 (required)</label>
                            <div class="flex flex-wrap gap-3">

 
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="0"  type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '0'}  />
      <span
        class="absolute text-red-600 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      0
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="1" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '1'} />
      <span
        class="absolute text-red-400 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      1
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="2" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"         checked={initial.Rating === '2'} />
      <span
        class="absolute text-red-300 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none">
     2
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="3" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '3'}  />
      <span
        class="absolute text-orange-300 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      3
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="4" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '4'} />
      <span
        class="absolute text-orange-200 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      4
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="5" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '5'} />
      <span
        class="absolute text-yellow-300 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      5
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="6" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '6'} />
      <span
        class="absolute text-yellow-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      6
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="7" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '7'} />
      <span
        class="absolute text-green-200 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      7
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="8" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '8'} />
      <span
        class="absolute text-green-300 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      8
    </label>
  </div>
 
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="9" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '9'} />
      <span
        class="absolute text-green-400 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      9
    </label>
  </div>
  <div class="inline-flex items-center">
    <label class="relative flex items-center p-3 rounded-full cursor-pointer" >
      <input name="Rating" onChange={setdata} value="10" type="radio"
        class="before:content[''] peer bg-white border-black  relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
        id="react"        checked={initial.Rating === '10'} />
      <span
        class="absolute text-green-600 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        </svg>
      </span>
    </label>
    <label class="mt-px font-bold text-lg  cursor-pointer select-none" >
      10
    </label>
  </div>
  
</div> 
                        </div>
                    </div>
          
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-10">
                            <label  class="text-xs font-semibold  px-1"> In what way has my team helped you?</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                                <textarea type="text" name='TeamHelped' onChange={setdata} class="w-full -ml-10 pl-2 min-h-16 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="If they have any Suggestions regarding service please enter."/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-10">
                            <label  class="text-xs font-semibold  px-1"> Suggestions (optional)</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                                <textarea type="text" name='Suggestions' onChange={setdata} class="w-full -ml-10 pl-2 min-h-20 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="If they have any Suggestions regarding service please enter."/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <button onClick={savedata} class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">SEND FEEDBACK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{/* <!-- BUY ME A BEER AND HELP SUPPORT OPEN-SOURCE RESOURCES --> */}
<div class="flex items-end justify-end absolute top-4 md:top-10 left-2 md:left-10 mb-4 mr-4 z-10">
    <div>
        <a title="Buy me a beer" target="_blank" class="block h-7 sm:h-12 md:h-16  transition-all  hover:shadow-lg transform hover:scale-110 hover:rotate-12">
            <img class="object-cover object-center w-full h-full " src={payclick}/>
        </a>
    </div>
</div>

<Dialog
        open={
          size === "xxl"
        }
        size={size || "md"}
        handler={handleOpen}
        className="bg-gray-200  justify-center h-screen w-full  opacity-60 "
      >
        <button onClick={() => handleOpen(null)} className="flex absolute text-black top-3 right-10 text-5xl">X</button>
        <div className="md:w-1/2 xl:w-[30%] mt-5 flex flex-col  bg-white rounded-2xl  justify-center mx-auto">
        <DialogBody>
        <div class="flex justify-center items-center py-5 rounded-lg dark:bg-gray-200">
    <div class="grid gap-8">
      <div
        id="back-div"
        class="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] mx-4"
      >
        <div
          class="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900  shadow-lg xl:px-10 2xl:px-10 lg:px-10 md:px-10 sm:px-2 m-2"
        >
          <h1 class="pt-2  font-bold dark:text-gray-400 text-xl text-center cursor-default">
            One Time  Verification
          </h1>
          <h1 className='text-xs my-2 w-full text-white'>OTP have been send in your WhatsApp Number</h1>
          <div method="POST" class="space-y-4">
            <div>
              <label for="email" class="mb-2  dark:text-gray-400 text-lg">OTP</label>
              <input
                class="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                type="text"
                onChange={(e)=>setOTP(e.target.value)}
                name="Email"
                required
              />
            </div>
            <button
              class="bg-gradient-to-r  dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-10 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              type="submit"
              onClick={()=>{
                matchOtp()
              }}
            >
              Verify
            </button>
          </div>
          <div
            class="text-gray-500 flex text-center flex-col mt-2 items-center text-sm"
          >
            <p class="cursor-default">
              {/* By signing in, you agree to our */}
      
              and
              <a
                class="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <button
                onClick={()=>sendOtp()}
                  class="cursor-pointer mx-2 bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  resend otp
                </button>
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
        </DialogBody>
        </div>
      </Dialog> 
</>
  )
}
