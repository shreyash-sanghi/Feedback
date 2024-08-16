import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs'; // Import dayjs for easier date calculations

export default function FeedbackDashboard() {
  const navigate = useNavigate();
  const [initial_data, setFinalData] = useState([]);
  const [filterDate, setFilterDate] = useState(""); // To store selected specific date
  const [filteredData, setFilteredData] = useState([]);

  const verifyUser = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    try {
      const result = await axios.get(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/get_feedback`);
      setFinalData(result.data.response);
      setFilteredData(result.data.response); // Initialize filtered data with all feedback
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        navigate(`/dashboard`);
      } else {
        alert(error);
      }
    }
  };

  const navItems = [
    { id: 1, text: 'My Team', path: `/admin_dashboard` },
    { id: 2, text: 'Feedback Message', path: `/feedback` },
  ];

  // Function to convert date from DD-MM-YYYY to YYYY-MM-DD
  const convertDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Function to handle filter based on date range
  const handleDateRangeFilter = (months) => {
    if (filterDate) {
      return; // If specific date is selected, ignore date range filter
    }
    const now = dayjs(); // Get current date
    const targetDate = now.subtract(months, 'month'); // Calculate date 'months' ago

    const filtered = initial_data.filter((result) => {
      const feedbackDateFormatted = dayjs(convertDateFormat(result.FeedbackDate));
      return feedbackDateFormatted.isAfter(targetDate); // Keep data within the range
    });
    setFilteredData(filtered);
  };

  // Function to handle specific date filtering
  const handleDateFilter = () => {
    if (!filterDate) {
      setFilteredData(initial_data); // Show all data if no specific date selected
      return;
    }

    const filtered = initial_data.filter((result) => {
      const feedbackDateFormatted = dayjs(convertDateFormat(result.FeedbackDate)).format('YYYY-MM-DD');
      return feedbackDateFormatted === filterDate; // Show data matching specific date
    });
    setFilteredData(filtered);
  };

  // Function to reset filters and show all data
  const handleShowAll = () => {
    setFilterDate(""); // Reset date filter
    setFilteredData(initial_data); // Show all data
  };

  useEffect(() => {
    verifyUser();
  }, []);

  // Use effect to apply filters based on changes
  useEffect(() => {
    if (filterDate) {
      handleDateFilter(); // Apply specific date filter
    } else {
      handleDateRangeFilter(1); // Default to last month if no specific date is selected
    }
  }, [initial_data, filterDate]);

  return (
    <div>
      <div className='flex sm:flex-row flex-col items-center justify-between bg-black text-white'>
        <div className="flex ml-10 mr-8">
          <Link to={`/admin_dashboard`} className="no-underline text-xl font-semibold md:text-blue-dark flex items-center py-4 sm:pr-20">
            <svg className="h-6 w-6 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M3.889 3h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H3.89A.9.9 0 0 1 3 12.09V3.91A.9.9 0 0 1 3.889 3zM3.889 15h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H3.89C3.398 21 3 20.616 3 20.143v-4.286c0-.473.398-.857.889-.857zM13.889 11h6.222a.9.9 0 0 1 .889.91v8.18a.9.9 0 0 1-.889.91H13.89a.9.9 0 0 1-.889-.91v-8.18a.9.9 0 0 1 .889-.91zM13.889 3h6.222c.491 0 .889.384.889.857v4.286c0 .473-.398.857-.889.857H13.89C13.398 9 13 8.616 13 8.143V3.857c0-.473.398-.857.889-.857z" />
            </svg>
            Dashboard
          </Link>
        </div>

        <ul className='flex'>
          <div className='' style={{ position: "relative", display: "inline-block" }}>
            <input
              type="date"
              onChange={(e) => {
                setFilterDate(e.target.value);
                // Apply specific date filter immediately
              }}
              value={filterDate}
              className="text-white sm:block hidden bg-black appearance-none focus:outline-none pr-10"
              style={{ padding: "10px", borderRadius: "5px", color: "white", border: "1px solid white", width: "200px" }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 sm:block hidden w-5"
              viewBox="0 0 20 20"
              fill="white"
              
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM4 5a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm0 2h12v10H4V7z" />
            </svg>
          </div>

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
              navigate('/dashboard');
            }}
            className='px-4 l m-2 cursor-pointer duration-300'
          >
            Log Out
          </button>
        </ul>
      </div>

      <div className='flex flex-wrap  justify-center space-x-4 mt-4'>
        <button className='text-white mt-2 bg-blue-500 px-4 py-2 rounded' onClick={handleShowAll}>
          All
        </button>
        <button className='text-white mt-2 bg-blue-500 px-4 py-2 rounded' onClick={() => handleDateRangeFilter(1)}>
          Last Month
        </button>
        <button className='text-white mt-2 bg-blue-500 px-4 py-2 rounded' onClick={() => handleDateRangeFilter(2)}>
          Last 2 Months
        </button>
        <button className='text-white mt-2 bg-blue-500 px-4 py-2 rounded' onClick={() => handleDateRangeFilter(6)}>
          Last 6 Months
        </button>
        <button className='text-white mt-2 bg-blue-500 px-4 py-2 rounded' onClick={() => handleDateRangeFilter(12)}>
          Last 1 Year
        </button>
        <input
              type="date"
              onChange={(e) => {
                setFilterDate(e.target.value);
                // Apply specific date filter immediately
              }}
              value={filterDate}
              className="text-white mt-2 sm:hidden block bg-blue-500 appearance-none focus:outline-none pr-10"
              style={{ padding: "10px", borderRadius: "5px", color: "white", border: "1px solid white", width: "200px" }}
            />
      </div>

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
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Feedback Date</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Member Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredData.map((result, index) => (
                <tr key={result.ID}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Name}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Number}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Rating}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.Suggestions}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.FeedbackDate}</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{result.MemberName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap leading-5">
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(`https://feedbackbackend-shreyash-sanghis-projects.vercel.app/delete_feedback/${result._id}`);
                          alert("Feedback removed successfully");
                          verifyUser();
                        } catch (error) {
                          alert(error);
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
  );
}
