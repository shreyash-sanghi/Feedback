import {React,useState,useEffect}from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "../api/axios"
import { toast } from 'react-toastify';
function StafDashboard() {
    const navigate = useNavigate();

    const [initial_data, setFinalData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const itemsPerPage = 20; // Limit of 20 items per page


    const navItems = [
        { id: 1, text: 'My Account',path:`/my_account` },
        { id: 2, text: 'My Feedback' , path:`/staf_dashboard` },
      ];


      const verifyUser = async () => {
        try {
          const result = await axios.get(`/get_Personal_feedback`);
          // Sort the data based on FeedbackDate and FeedbackTime
          const sortedData = result.data.response.sort((a, b) => {
            const aDateTime = dayjs(`${convertDateFormat(a.FeedbackDate)} ${a.FeedbackTime}`);
            const bDateTime = dayjs(`${convertDateFormat(b.FeedbackDate)} ${b.FeedbackTime}`);
            return bDateTime - aDateTime; // Descending order
          });
          setFinalData(sortedData);
        } catch (error) {
          console.log(error.response.status);
          if (error.response.status === 401) {
            navigate(`/login_dashboard`);
          } else {
           toast.error(error);
          }
        }
      };

        // Function to convert date from DD-MM-YYYY to YYYY-MM-DD
  const convertDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

    // Calculate pagination data
    const totalPages = Math.ceil(initial_data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = initial_data.slice(startIndex, startIndex + itemsPerPage);
  
    // Function to handle page change
    const goToPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };

      useEffect(() => {
        verifyUser();
      }, []);
  return (
    <div>
           <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
      <div class="flex ml-10 mr-8">
            <p class="no-underline  text-xl font-semibold  md:text-blue-dark flex items-center py-4 sm:pr-20">
              <svg class="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z"/></svg>              Dashboard
            </p>
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
      <div>

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
              {currentItems.map((result, index) => (
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
        <div className="flex justify-center items-center mt-4">
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border border-gray-300 rounded-md mx-1 ${currentPage === page ? 'bg-gray-300' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default StafDashboard
