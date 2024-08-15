import {React,useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function FeedbackDashboard() {
  const [initial_data,final_data] = useState([]);


  const verifyUser = async()=>{
    const token = sessionStorage.getItem('token');
     if (token) {
     axios.defaults.headers.common['Authorization'] = token;
     }
      try {
          const result = await axios.get(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/get_feedback`);
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
  const navItems = [
    { id: 1, text: 'My Team',path:`/admin_dashboard` },
    { id: 2, text: 'Feedback Message' , path:`/feedback` },
  ];
console.log(initial_data)
  useEffect(()=>{
    verifyUser();
  },[])
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
      <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
                <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Customer Name</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Number</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Rating</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Suggestions</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Member Name</th>
                                <th class="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider"></th>
                            </tr>
                        </thead>
                        {initial_data.map((result,index)=>{
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
                                    <td class="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm whitespace-nowrap leading-5">{result.Rating}</td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm whitespace-nowrap leading-5">{result.Suggestions}</td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b text-blue-500 font-semibold   border-gray-500 text-sm whitespace-nowrap leading-5">{result.MemberName}</td>
                                    <td class="px-6 py-4 whitespace-no-wrap   leading-5">
                                      <button onClick={async()=>{
                                        try {
                                          await axios.delete(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/delete_feedback/${result._id}`)
                                          alert("success..")
                                          verifyUser();
                                        } catch (error) {
                                          alert(error);
                                        }
                                      }} className='text-red-500'>Remove</button>
                                    </td>

      
                          </tr>


                        </tbody>
                        </>)})}
                  
                    </table>

                </div>
        </div>
    </div>
  )
}
