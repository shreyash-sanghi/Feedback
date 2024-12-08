import React, { useEffect, useState } from 'react'
import axios from "../api/axios.js"
import { useNavigate ,Link} from 'react-router-dom';
import { imageDb } from "./Config.js";
import { ref, uploadBytes,deleteObject ,getDownloadURL,getStorage} from "firebase/storage";   
import User_profile from "../assets/user_profile.jpg"
import {v4} from 'uuid';
import { toast } from 'react-toastify';
export default function AdminDashboard() {
  const [initial_data, final_data] = useState([]);
  const [downloadUrls, setDownloadUrls] = useState({});
  const [EditData,setEditData] = useState({
    tid:"",
    Name:"",
    Number:"",
    Email:""
  })
  const [EditBool,setEditBool] = useState(false);
  
  const [initial,final]= useState({
    Name:"",
    Number:"",
    Email:"",
    Code:""
  })
  const [EditProfile,SetEditProfile] = useState();
  const [PastProfile,SetPastProfile] = useState();
  const [PastProfileName,SetPastProfileName] = useState();
  const [profile,setProfile] = useState();
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const setdata = (e)=>{
    const {name,value} = e.target;
    final((info)=>{
      return{
        ...info,
        [name]:value
      }
    })
  }
  const setEdit = (e)=>{
    const {name,value} = e.target;
    setEditData((info)=>{
      return{
        ...info,
        [name]:value
      }
    })
  }

  const savedata = async()=>{
    try {
     const {Name,Number,Email,Code} = initial;
    if (profile === undefined){
      toast.error("Please Uplode Profile...")
    }
    else if(Name === ""){
         toast.error("Please Enter Your Name... ")
         return;
     }
     else if(Number === ""){
         toast.error("Please Enter Valid Number... ")
         return;
     }
     else if(Email === ""){
         toast.error("Please Provide Email... ")
         return;
     }
     else if(Code === ""){
         toast.error("Please Provide Code... ")
         return;
     }
     else{
      const storage = getStorage();
      const image = `${profile.name + v4()}`;
     const imgref = ref(storage,`files/${image}`);
  
      await axios.post(`/add_team`,{
        Name,Number,Email,Profile:image,Code
      })
      try {
        uploadBytes(imgref,profile)
        
      } catch (error) {
        toast("Your Profile have not uplode")
        setLoading(false)
          return;
      }
      verifyUser()
     toast.success("Success...")
 }
    } catch (error) {
     toast.error(error)
    }
 }
  const saveupdatedata = async()=>{
    try {
     const {Name,Number,Email,tid} = EditData;
    if (PastProfile === undefined && EditProfile === undefined){
      toast.error("Please Uplode Profile...")
    }
    else if(Name === ""){
         toast.error("Please Enter Your Name... ")
         return;
     }
     else if(Number === ""){
         toast.error("Please Enter Valid Number... ")
         return;
     }
     else if(Email === ""){
         toast.error("Please Provide Email... ")
         return;
     }
     else{
      if(PastProfile === undefined){
        const storage = getStorage();
        const image = `${EditProfile.name + v4()}`;
       const imgref = ref(storage,`files/${image}`);
       await axios.post(`/edit_team_member/${tid}`,{
        Name,Number,Email,Profile:image
      })
      try {
        uploadBytes(imgref,EditProfile)
      } catch (error) {
        setLoading(false)
          return;
      }
      }
      else if(PastProfile != undefined && EditProfile === undefined ){
        await axios.post(`/edit_team_member/${tid}`,{
          Name,Number,Email
        })
      }
      else if(PastProfile != undefined && EditProfile != undefined){
        const storage = getStorage();
        const desertRef = ref(storage,`files/${PastProfileName}`);
        await deleteObject(desertRef)
        const image = `${EditProfile.name + v4()}`;
        const imgref = ref(storage,`files/${image}`);
        await axios.post(`/edit_team_member/${tid}`,{
         Name,Number,Email,Profile:image
       })
       try {
         uploadBytes(imgref,EditProfile)
       } catch (error) {
         setLoading(false)
           return;
       }
      }
  

      verifyUser()
     toast.success("Success...")
 }
    } catch (error) {
     toast.error(error)
    }
 }


      const verifyUser = async()=>{
          try {
              const result = await axios.get(`/get_team`);
              final_data(result.data.response)

              // Fetch download URLs for profiles
      const storage = getStorage();
      const urls = {};

      await Promise.all(
        result.data.response.map(async (data) => {
          if (data.Profile) {
            try {
              const url = await getDownloadURL(ref(storage, `files/${data.Profile}`));
              urls[data._id] = url;
            } catch (error) {
              console.error(`Error fetching URL for ${data.Profile}:`, error);
            }
          }
        })
      );

      setDownloadUrls(urls);

          } catch (error) {
            console.log(error.response.status);
            if(error.response.status===401){
              navigate(`/login_dashboard`)
            }else{
              toast.error(error);
            }
          }
      }

        // Array containing navigation items
 
        const navItems = [
          { id: 1, text: 'My Account',path:`/my_account` },
          { id: 1, text: 'My Team',path:`/admin_dashboard` },
          { id: 2, text: 'Feedback Message' , path:`/feedback` },
  
        ];
      useEffect(()=>{
        verifyUser();
      },[])

    const copyToClipboard = (link, index) => {
      navigator.clipboard.writeText(link);
      setCopiedIndex(index); // Set the copied index to update the button
      setTimeout(() => {
        setCopiedIndex(null); // Reset after 3 seconds
      }, 3000);
    };
  return (
    <div>
      <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
      <div class="flex ml-10 mr-8">
            <Link to={`/dashboard`} class="no-underline  text-xl font-semibold  md:text-blue-dark flex items-center py-4 sm:pr-20">
              <svg class="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z"/></svg>              Dashboard
            </Link>
          </div>

      {/* Desktop Navigation */}
      <ul className='flex '>
        {navItems.map(item => (
          <Link
          to={item.path}
            // key={item.id}
            className='px-4 l m-2 cursor-pointer duration-300 '
          >
            {item.text}
          </Link>
                
        ))}
        <button
           onClick={
            ()=>{
              sessionStorage.removeItem("token");
               navigate('/login_dashboard')   
            }
           }
            className='px-4 l m-2 cursor-pointer duration-300 '
          >
            Log Out
          </button>
      </ul>
      </div>
          <div class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" >
        <div class="md:flex w-full">

            <div class="w-full py-10 px-5 md:px-10">
                <div class="text-center mb-10">
                    <h1 class="font-bold text-3xl text-gray-900">Add Team</h1>
                    {/* <p>Enter your information to register</p> */}
                </div>
                <div>
                  

{(EditBool)?(<>
  {(EditProfile === undefined) ? (<>
  {(PastProfile === undefined)?(<>
    <div
                            class={`mx-auto flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                            style={{ backgroundImage: `url(${User_profile})` }}                       
                            >
                          <a href="#">       
              </a>
                            <div class="bg-white/90 rounded-full w-4 h-4 text-center ml-20 mt-4">

                                <input onChange={(e)=>SetEditProfile(e.target.files[0])} type="file" name="profile" id="upload_profile" hidden />

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>   
  </>):(<>
    <div
                     class={`mx-auto flex justify-center w-[100px] h-[100px]  rounded-full bg-cover bg-center bg-no-repeat`}      
                            // style={{ backgroundImage: PastProfile }}                       
                            >
                              <img  class={`mx-auto ml-4 flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}  src={PastProfile}/>
                          <a href="#">
        
              </a>
                            <div class="bg-white/90 rounded-full w-6 h-6 text-center  mt-4">

                                <input onChange={(e)=>SetEditProfile(e.target.files[0])} type="file" name="profile" id="upload_profile" hidden />

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>      
  </>)}
                                     </>) : (<>
                            <div
                            class={`mx-auto flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                            style={{ backgroundImage: `url(${URL.createObjectURL(EditProfile)})` }}                       
                            >
                          <a href="#">
        
              </a>
                            <div class="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">

                                <input onChange={(e)=>SetEditProfile(e.target.files[0])} type="file" name="profile" id="upload_profile" hidden />

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>                </>)}
        <h1 className='flex justify-center my-2 text-black'>My Profile</h1>
  <div class="flex -mx-3">
                        <div class="w-1/2 px-3 mb-5">
                            <label class="text-xs font-semibold px-1">Name</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input  value={EditData.Name} onChange={setEdit} name='Name' type="text" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John"/>
                            </div>
                        </div>
                        <div class="w-1/2 px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Number</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input value={EditData.Number}  onChange={setEdit} name='Number'   type="number" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="12345678"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center  -mx-3">
              
              <div class="w-1/2 px-3 mb-10">
                  <label  class="text-xs font-semibold  px-1"> Email</label>
                  <div class="flex">
                      <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                      <input type="email" value={EditData.Email} name='Email' onChange={setEdit}  class="w-full -ml-10 pl-2  pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="abc@gmail.com"/>
                  </div>
                  
              </div>
                  <div class="w-1/3 px-3 mb-5">
                  <button onClick={saveupdatedata} class="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold">Save Update Profile </button>
              </div>  
          </div>
</>):(<>
  {(profile === undefined) ? (<>
                            <div
                            class={`mx-auto flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                            style={{ backgroundImage: `url(${User_profile})` }}                       
                            >
                          <a href="#">       
              </a>
                            <div class="bg-white/90 rounded-full w-4 h-4 text-center ml-20 mt-4">

                                <input onChange={(e)=>setProfile(e.target.files[0])} type="file" name="profile" id="upload_profile" hidden />

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>                </>) : (<>
                            <div
                            class={`mx-auto flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                            style={{ backgroundImage: `url(${URL.createObjectURL(profile)})` }}                       
                            >
                          <a href="#">
        
              </a>
                            <div class="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">

                                <input onChange={(e)=>setProfile(e.target.files[0])} type="file" name="profile" id="upload_profile" hidden />

                                <label for="upload_profile">
                                        <svg data-slot="icon" class="w-6 h-5 text-blue-700" fill="none"
                                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                            </path>
                                        </svg>
                                    </label>
                            </div>
                        </div>                </>)}
                            <h1 className='flex justify-center my-2 text-black'>My Profile</h1>
  <div class="flex -mx-3">
                        <div class="w-1/2 px-3 mb-5">
                            <label class="text-xs font-semibold px-1">Name</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input  onChange={setdata} name='Name' type="text" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John"/>
                            </div>
                        </div>
                        <div class="w-1/2 px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Number</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input  onChange={setdata} name='Number'   type="number" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="12345678"/>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center  -mx-3">
              
              <div class="w-1/2 px-3 mb-10">
                  <label  class="text-xs font-semibold  px-1"> Email</label>
                  <div class="flex">
                      <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                      <input type="email" name='Email' onChange={setdata}  class="w-full -ml-10 pl-2  pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="abc@gmail.com"/>
                  </div>
                  
              </div>
              <div class="w-1/2 px-3 mb-10">
                  <label  class="text-xs font-semibold  px-1"> Code</label>
                  <div class="flex">
                      <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                      <input type="password" name='Code' onChange={setdata}  class="w-full -ml-10 pl-2  pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="*******"/>
                  </div>
                  
              </div>
              
          </div>
                  <div class=" flex justify-end px-3 mb-5">
                  <button onClick={savedata} class="block w-1/3 max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold">Save</button>
              </div>  
</>)}
    

       

                </div>
            </div>
        </div>
          </div>
           <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
                <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Profile</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Name</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Number</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Email</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Link</th>
                            </tr>
                        </thead>
                        {initial_data.map((result, index) => {
        const link = `https://payclickfeedback.vercel.app/${result._id}`;

        return (
          <tbody className="bg-white" key={result._id}>
            <tr>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm leading-5 text-gray-800">#{index + 1}</div>
                  </div>
                </div>
              </td>

              {(result.Profile !== undefined) ? (
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 whitespace-nowrap text-blue-900">
                    {downloadUrls[result._id] ? (
                      <img src={downloadUrls[result._id]} alt={result.Name} className="w-10 rounded-full h-10" />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </td>
              ) : (
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 whitespace-nowrap text-blue-900"></div>
                </td>
              )}

              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 whitespace-nowrap text-blue-900">{result.Name}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 whitespace-nowrap text-blue-900">{result.Number}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm whitespace-nowrap leading-5">
                {result.Email}
              </td>
              <td className="px-6 py-4 border-b border-gray-500 text-sm leading-5">
                <div className="truncate w-16" title={link}>{link}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-500 text-right">
                <button
                  onClick={() => copyToClipboard(link, index)}
                  className={`py-1 px-2 rounded ${
                    copiedIndex === index ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold`}>
                  {copiedIndex === index ? 'Copied' : 'Copy Link'}
                </button>
              </td>
              <td className="py-4 whitespace-no-wrap leading-5">
                <button
                  onClick={async () => {
                    window.scroll({top:0})
                setEditData({
                  tid:result._id,
                  Name:result.Name,
                  Number:result.Number,
                  Email:result.Email,
                })
                SetPastProfileName(result.Profile)
                SetPastProfile(downloadUrls[result._id])
                
                  }}
                  className="text-green-500">
                 Edit
                </button>
              </td>
              <td className="py-4 whitespace-no-wrap leading-5">
                <button
                  onClick={async () => {
                    try {
                      const con = confirm("Have you confirm to delete...");
                      if (con) {
                        await axios.delete(`/delete_team_member/${result._id}`);
                        toast.success("success..");
                        const storage = getStorage();
                        const desertRef = ref(storage,`files/${result.Profile}`);
                        await deleteObject(desertRef)
                        verifyUser();
                      }
                    } catch (error) {
                      toast.error(error);
                    }
                  }}
                  className="text-red-500">
                  Remove
                </button>
              </td>
            
            </tr>
          </tbody>
        );
      })}
                  
                    </table>

                </div>
        </div>
    </div>
  )
}
