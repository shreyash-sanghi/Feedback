import React, { useEffect, useState } from 'react'
import axios from "../api/axios"
import { useNavigate ,Link} from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Dashboard() {
const navigate = useNavigate();
const [initial,final] = useState([]);
const [feedbackCount, setFeedbackCount] = useState({});
const [totalCoin, setTotalCoin] = useState({});

const verifyUser = async () => {
    try {
      const result = await axios.get(`/get_feedback`);
      const response = result.data.response;

      // Get today's date in 'DD-MM-YYYY' format
      const today = new Date();
          // Get current month and year
    const currentMonth = today.getMonth() + 1; // January is 0!
    const currentYear = today.getFullYear();
      const todayFormatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

         // Get unique team members
    const teamMembers = [...new Set(response.map(feedback => feedback.MemberName))];

      // Filter responses for today's date
      const todaysResponses = response.filter(
        feedback => feedback.FeedbackDate === todayFormatted
      );
   // Filter responses for the current month
   const monthlyResponses = response.filter(feedback => {
    const [day, month, year] = feedback.FeedbackDate.split('-').map(Number);
    return month === currentMonth && year === currentYear;
  });

    // Initialize counts for all team members with 0
    const todayCount = teamMembers.reduce((acc, member) => {
      acc[member] = 0;
      return acc;
    }, {});

          // Count feedbacks by each team member for the month
          const monthlyCount = teamMembers.reduce((acc, member) => {
            acc[member] = 0;
            return acc;
          }, {});

              // Count feedbacks by each team member for today
    todaysResponses.forEach(feedback => {
        const member = feedback.MemberName;
        todayCount[member]++;
      });
  
      // Count feedbacks by each team member for the month
      monthlyResponses.forEach(feedback => {
        const member = feedback.MemberName;
        monthlyCount[member]++;
      });

      setTotalCoin(monthlyCount)
      final(todaysResponses);
      setFeedbackCount(todayCount);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate(`/login_dashboard`);
      } else {
        toast.error(error);
      }
    }
  };
      
        // Array containing navigation items
        const navItems = [
            { id: 1, text: 'My Team',path:`/admin_dashboard` },
            { id: 2, text: 'Feedback Message' , path:`/feedback` },
          ];

      useEffect(()=>{
       verifyUser();
      },[])

      const TdStyle = {
        ThStyle: `w-1/6 min-w-[160px] border-l text-dark  border-transparent py-4 px-3 text text-lg font-medium text-blue-500 lg:py-7 lg:px-4`,
        TdStyle: `text-dark border-b border-l border-[#E8E8E8] bg-[#F3F6FF] dark:bg-dark-3 dark:border-dark dark:text-dark-7 py-5 px-2 text-center text-base font-medium`,
        TdStyle2: `text-dark border-b border-[#E8E8E8] bg-white dark:border-dark dark:bg-dark-2 dark:text-dark-7 py-5 px-2 text-center text-base font-medium`,
        TdButton: `inline-block px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium`,
      }
  return (
    <div>
          <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
        <div className="flex flex-wrap items-center w-full sm:w-fit justify-between  ml-10 mr-8">
          <Link to={`/dashboard`} className="no-underline text-xl font-semibold md:text-blue-dark flex items-center py-4 sm:pr-20">
            <svg className="h-6 w-6 fill-current sm:mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z" />
            </svg>
            Dashboard
          </Link>
        </div>
        <ul className='flex items-center'>
          {navItems.map(item => (
            <Link
              to={item.path}
              key={item.id}
              className='px-4 l m-2 cursor-pointer duration-300'
            >
              {item.text}
            </Link>
          ))}

          <button
            onClick={() => {
              sessionStorage.removeItem("token");
              navigate('/login_dashboard');
            }}
            className='px-4 l m-2 cursor-pointer duration-300'
          >
            Log Out
          </button>
        </ul>
      </div>

      <div className='mt-6'>
        <h2 className='mt-4 flex justify-center underline md:text-xl text-lg font-bold my-5 text-blue-500 lg:text-2xl'>Feedback Summary for Today</h2>
     
        <section className='bg-white dark:bg-dark mb-10x'>
      <div className='container'>
        <div className='flex flex-wrap -mx-4'>
          <div className='w-full '>
            <div className='max-w-full overflow-x-auto'>
              <table className='w-full table-auto'>
                <thead className='text-center text-black bg-primary'>
                  <tr>
                    <th className={TdStyle.ThStyle}> Member Name </th>
                    <th className={TdStyle.ThStyle}>Total Today Feedback </th>
                    <th className={TdStyle.ThStyle}>Total  Coin </th>

                  </tr>
                </thead>

                <tbody>
                {Object.keys(feedbackCount).map(member => (
  <tr>
  <td className={TdStyle.TdStyle}>{member}</td>
  <td className={TdStyle.TdStyle2}>{feedbackCount[member]}</td>
  <td className={TdStyle.TdStyle}>{totalCoin[member]/10}</td>

</tr>
  ))}
                
               
             
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
        <h3 className='mt-4 flex justify-center underline md:text-xl text-lg font-bold my-5 text-blue-500 lg:text-2xl'>Today's Feedback Responses:</h3>
        {/* <ul>
          {initial.map((feedback, index) => (
            <li key={index}>
              {feedback.teamMemberName}: {feedback.FeedbackMessage} at {feedback.FeedbackTime}
            </li>
          ))}
        </ul> */}
           <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Customer Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Number</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Rating</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Suggestions</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Feedback Time</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Feedback Date</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Member Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {initial.map((result, index) => (
                <tr key={result.ID}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Name}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Number}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Rating}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Suggestions}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.FeedbackTime}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.FeedbackDate}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.MemberName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap leading-5">
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(`/delete_feedback/${result._id}`);
                          toast.success("Feedback removed successfully");
                          verifyUser();
                        } catch (error) {
                          toast.error(error);
                        }
                      }}
                      className='text-red-500'
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}
