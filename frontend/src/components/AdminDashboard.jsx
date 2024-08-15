import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate ,Link} from 'react-router-dom';
export default function AdminDashboard() {
  const [initial_data,final_data] = useState([]);
  const [initial,final]= useState({
    Name:"",
    Number:"",
    Email:""
  })
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
      await axios.post(`http://localhost:7000/add_team`,{
        Name,Number,Email
      })
      verifyUser()
     alert("Success...")
 }
    } catch (error) {
     alert("They have some error...")
    }
 }


    const verifyUser = async()=>{
      const token = sessionStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = token;
}
        try {
            const result = await axios.get(`http://localhost:7000/get_team`);
            final_data(result.data.response)
        } catch (error) {
          console.log(error.response.status);
          if(error.response.status===401){
            navigate(`/dashboard`)
          }else{
            alert(error);

          }
        }
    }

        // Array containing navigation items
        const navItems = [
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
      <div className='flex items-center justify-between bg-black text-white'>
      <div class="flex ml-10 mr-8">
            <Link to={`/admin_dashboard`} class="no-underline  text-xl font-semibold  md:text-blue-dark flex items-center py-4 sm:pr-20">
              <svg class="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z"/></svg>              Dashboard
            </Link>
          </div>

      {/* Desktop Navigation */}
      <ul className='flex'>
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
               navigate('/dashboard')   
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
                            <div class="w-1/3 px-3 mb-5">
                            <button onClick={savedata} class="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-700 focus:bg-green-700 text-white rounded-lg px-3 py-3 font-semibold">Save</button>
                        </div>  
                    </div>
                    {/* <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <button  class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">SEND FEEDBACK</button>
                        </div>
                    </div> */}
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
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Name</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Number</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Email</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Link</th>
                            </tr>
                        </thead>
                        {initial_data.map((result,index)=>{
                           const link = `http://localhost:5174/${result._id}`;
                            return(<>
                              <tbody class="bg-white">
                                <tr>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="text-sm leading-5 text-gray-800">#{index +1}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                        <div class="text-sm leading-5 whitespace-nowrap text-blue-900">{result.Name}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                        <div class="text-sm leading-5 whitespace-nowrap text-blue-900">{result.Number}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm whitespace-nowrap leading-5">{result.Email}</td>
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
                    <td class=" py-4 whitespace-no-wrap   leading-5">
                                      <button onClick={async()=>{
                                        try {
                                          const con = confirm("Have you confirm to delete...");
                                          if(con){
                                            await axios.delete(`http://localhost:7000/delete_team_member/${result._id}`)
                                            alert("success..")
                                            verifyUser();
                                          }
                                       
                                        } catch (error) {
                                          alert(error);
                                        }
                                      }} className='text-red-500'>Remove</button>
                                    </td>
                    {/* {(copiedIndex)?(<>
                      <td className="px-6 py-4 border-b border-gray-500 text-right">
                      <button onClick={() => copyToClipboard(link)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                        Link
                      </button>
                    </td>
                    </>):(<>
                    <td className="px-6 py-4 border-b border-gray-500 text-right">
                      <button onClick={() => copyToClipboard(link)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                        Copy Link
                      </button>
                    </td>
                    </>)} */}
                          </tr>


                        </tbody>
                        </>)})}
                  
                    </table>

                </div>
        </div>
    </div>
  )
}
