import {React,useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import User_profile from "../assets/user_profile.jpg"
import { getStorage,getDownloadURL,ref, deleteObject,uploadBytes } from 'firebase/storage';
import {v4} from "uuid";
function Account() {
   const navigate = useNavigate();
   const [EditData,setEditData] = useState({
    tid:"",
    Name:"",
    Number:"",
    Email:""
  })
  const [EditBool,setEditBool] = useState(false);
  const [initial,final]= useState({
    tid:"",
    Name:"",
    Number:"",
    Email:"",
    ProfileName:"",
    ProfileUrl:"",
    Position:""
  });
  const [profile,setProfile] = useState();

  const verifyUser = async()=>{
    const token = sessionStorage.getItem('token');
if (token) {
axios.defaults.headers.common['Authorization'] = token;
}
      try {
          const result = await axios.get(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/get_myaccount`);
          // Fetch download URLs for profiles
          const data = result.data.response;
          if(data.Profile != undefined){
            const storage = getStorage();
            const url = await getDownloadURL(ref(storage, `files/${data.Profile}`));
            console.log(data)
            final({   
              tid:data._id,
              Name:data.Name,
              Number:data.Number,
              Email:data.Email,
              ProfileName:data.Profile,
              ProfileUrl:url,
              Position:data.Position
            })
            console.log(data)
          }else{
            final({   
              tid:data._id,
              Name:data.Name,
              Number:data.Number,
              Email:data.Email,
              ProfileName:undefined,
              ProfileUrl:undefined,
              Position:data.Position
            }) 
          }

      } catch (error) {
        console.log(error.response.status);
        if(error.response.status===401){
          navigate(`/login_dashboard`)
        }else{
          alert(error);
        }
      }
  }
  
  const setdata = (e)=>{
    const {name,value} = e.target;
    final((info)=>{
      return{
        ...info,
        [name]:value
      }
    })
  }

  const savedata = async()=>{
    try {
     const {Name,Number,Email} = initial;
      if(Name === ""){
         alert("Please Enter Your Name... ")
         return;
     }
     else if(Number === ""){
         alert("Please Enter Valid Number... ")
         return;
     }
     else if(Email === ""){
         alert("Please Provide Email... ")
         return;
     }
     else{
      if(profile == undefined){
        await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/update_team_account`,{
          Name,Number,Email
         })
      }
      else{
          const storage = getStorage();
      const image = `${profile.name + v4()}`;
     const imgref = ref(storage,`files/${image}`);
        if(initial.ProfileUrl == undefined && initial.ProfileName == undefined){
              await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/update_team_account`,{
        Name,Number,Email,Profile:image
       })
        }else{
          const pastProfileRef = ref(storage,`files/${initial.ProfileName}`);
          await axios.post(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/update_team_account`,{
            Name,Number,Email,Profile:image
          })
          deleteObject(pastProfileRef);
        }
      try {
        uploadBytes(imgref,profile)
      } catch (error) {
        alert("Your Profile have not uplode")
          return;
      }
      }
      setProfile();
      verifyUser();
     alert("Success...")
 }
    } catch (error) {
     alert(error)
    //  alert("They have some error...")
    }
 }
useEffect(()=>{
    verifyUser();
  },[])
  const navItems1 = [
    { id: 1, text: 'My Account',path:`/my_account` },
    { id: 1, text: 'My Team',path:`/admin_dashboard` },
    { id: 2, text: 'Feedback Message' , path:`/feedback` },

  ];
  const navItems2 = [
    { id: 1, text: 'My Account',path:`/my_account` },
    { id: 2, text: 'My Feedback' , path:`/staf_dashboard` },

  ];
  console.log(initial)
  return (
    <div>
      {(!initial.tid)?(<>Loding...</>):(<>
      {(initial.Position === "Admin")?(<>
            <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
      <div class="flex ml-10 mr-8">
            <Link to={`/dashboard`} class="no-underline  text-xl font-semibold  md:text-blue-dark flex items-center py-4 sm:pr-20">
              <svg class="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z"/></svg>              Dashboard
            </Link>
          </div>

      {/* Desktop Navigation */}
      <ul className='flex '>
        {navItems1.map(item => (
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
      </>):(<>
        <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
      <div class="flex ml-10 mr-8">
            <p class="no-underline  text-xl font-semibold  md:text-blue-dark flex items-center py-4 sm:pr-20">
              <svg class="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z"/></svg>              Dashboard
            </p>
          </div>

      {/* Desktop Navigation */}
      <ul className='flex '>
        {navItems2.map(item => (
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
      </>)}
      <div className='mt-10'>
      {(initial.ProfileUrl === undefined) ? (<>
      {(profile == undefined)?(<>
      
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
                        </div>   
      </>):(<>
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
                        </div>   
      </>)}
                                    </>) : (<>
                                      {(profile == undefined)?(<>
      
      <div
                          class={`mx-auto flex justify-center w-[100px] h-[100px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                          style={{ backgroundImage: `url(${initial.ProfileUrl})` }}                       
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
                      </div>   
    </>):(<>
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
                      </div>   
    </>)}
                                    </>)}


                                    <div class="flex flex-col items-center">
                        <div class="w-1/2 px-3 mb-5">
                            <label class="text-xs font-semibold px-1">Name</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input  onChange={setdata} value={initial.Name} name='Name' type="text" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="John"/>
                            </div>
                        </div>
                        <div class="w-1/2 px-3 mb-5">
                            <label  class="text-xs font-semibold px-1">Number</label>
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><i class="mdi mdi-account-outline text-gray-400 text-lg"></i></div>
                                <input value={initial.Number} onChange={setdata} name='Number'   type="number" class="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="12345678"/>
                            </div>
                        </div>
                        <div class="w-1/2 px-3 mb-10">
                  <label  class="text-xs font-semibold  px-1"> Email</label>
                  <div class="flex">
                      <div class="w-10 z-10 pl-1  text-center pointer-events-none flex items-center justify-center"></div>
                      <input type="email" name='Email' value={initial.Email} onChange={setdata}  class="w-full -ml-10 pl-2  pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="abc@gmail.com"/>
                  </div>
                  
              </div>
              <div class="w-1/2 px-3 mb-10">
                  <button onClick={savedata} class="block w-full  mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold">Save</button>
              </div> 
                    </div>

                                       
                                    </div>
      </>)}
    </div>
  )
}

export default Account
