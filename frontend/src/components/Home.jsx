import axios from 'axios';
import React, { useState } from 'react'
import payclick from "../assets/payclick.webp"
import payclickmobile from "../assets/mobilepay.png"
import { useParams } from 'react-router-dom';
export default function Home() {
const {id} = useParams();
    const [initial,final] = useState({
        Name:"",
        Number:"",
        Rating:"",
        Suggestions:"",

    })
    const setdata = (e)=>{
        const {name,value} = e.target;
        final((info)=>{
            return{
                ...info,
                [name] :value
            }
        })
    }
    const savedata = async()=>{
       try {
        const {Name,Number,Rating, Suggestions} = initial;
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
        else{
          const date = new Date();

          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
              let currentDate = `${day}-${month}-${year}`;
         await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/send_feedback/${id}`,{
            Name,Number,Rating, Suggestions,FeedbackDate:currentDate
         })
        alert("Thankyou For You Feedback...")
        window.location.href = 'https://www.payclick.co.in/Web/Default.aspx';
    }
       } catch (error) {
        alert("They have some error...")
       }
    }

  return (
<>
<div class="min-w-screen max-h-screen flex items-center justify-center px-5 py-5">
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
                                <input onChange={setdata} name='Name' type="text" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John"/>
                            </div>
                        </div>
           
                    </div>
                    <div class="flex -mx-3">
                      
                        <div class="w-full px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Number</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input onChange={setdata} name='Number'   type="number" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="12345678"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Rating for service 0 to 10 (required)</label>
                            <div class="flex flex-wrap gap-10">

 
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
                            <label  class="text-xs font-semibold  px-1"> Suggestions (optional)</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                                <textarea type="text" name='Suggestions' onChange={setdata} class="w-full -ml-10 pl-2 min-h-28 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="If they have any Suggestions regarding service please enter."/>
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
</>
  )
}
