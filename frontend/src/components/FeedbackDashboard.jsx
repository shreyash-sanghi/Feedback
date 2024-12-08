import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import dayjs from 'dayjs'; // Import dayjs for easier date calculations
import { toast } from 'react-toastify';

export default function FeedbackDashboard() {
  const navigate = useNavigate();
  const [initial_data, setFinalData] = useState([]);
  const [filterDate, setFilterDate] = useState(""); // To store selected specific date
  const [filterMemberName, setFilterMemberName] = useState(""); // To store selected member name
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 20; // Limit of 20 items per page
  const [feedbackCounts, setFeedbackCounts] = useState({});

  const verifyUser = async () => {
    try {
      const result = await axios.get(`/get_feedback`);
      
      // Sort the data based on FeedbackDate and FeedbackTime
      const sortedData = result.data.response.sort((a, b) => {
        const aDateTime = dayjs(`${convertDateFormat(a.FeedbackDate)} ${a.FeedbackTime}`);
        const bDateTime = dayjs(`${convertDateFormat(b.FeedbackDate)} ${b.FeedbackTime}`);
        return bDateTime - aDateTime; // Descending order
      });

      setFinalData(sortedData);
      setFilteredData(sortedData);
         // Calculate the feedback counts for each member
         calculateFeedbackCounts(sortedData);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        navigate(`/login_dashboard`);
      } else {
        toast.error(error);
      }
    }
  };

  const calculateFeedbackCounts = (data) => {
    const currentMonth = dayjs().month(); // Get the current month
    const counts = data.reduce((acc, feedback) => {
      const feedbackMonth = dayjs(feedback.FeedbackDate, 'DD-MM-YYYY').month();
      if (feedbackMonth === currentMonth) {
        acc[feedback.MemberName] = (acc[feedback.MemberName] || 0) + 1;
      }
      return acc;
    }, {});
    setFeedbackCounts(counts);
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

  // Function to handle filtering based on both date and member name
  const handleFilters = () => {
    let filtered = initial_data;
    if (filterDate) {
      const formattedFilterDate = dayjs(filterDate).format('YYYY-MM-DD');
      filtered = filtered.filter((result) => {
        const feedbackDateFormatted = dayjs(convertDateFormat(result.FeedbackDate)).format('YYYY-MM-DD');
        return feedbackDateFormatted === formattedFilterDate;
      });
    }

    if (filterMemberName) {
      filtered = filtered.filter((result) => result.MemberName.toLowerCase().includes(filterMemberName.toLowerCase()));
    }

    setFilteredData(filtered);
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

  // Function to reset filters and show all data
  const handleShowAll = () => {
    setFilterDate(""); // Reset date filter
    setFilterMemberName(""); // Reset member name filter
    setFilteredData(initial_data); // Show all data
  };

  useEffect(() => {
    verifyUser();
  }, []);

  // Use effect to apply filters based on changes
  useEffect(() => {
    handleFilters(); // Apply filters whenever data or filter criteria change
  }, [initial_data, filterDate, filterMemberName]);


    // Calculate pagination data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
    // Function to handle page change
    const goToPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
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
          <input
              type="text"
              placeholder="Filter by Member Name"
              onChange={(e) => setFilterMemberName(e.target.value)}
              value={filterMemberName}
              className="text-white border-2 h-fit rounded-md px-2  sm:hidden block mr-2 bg-black appearance-none focus:outline-none "
              // style={{ padding: "5px", borderRadius: "5px", color: "white", border: "1px solid white", width: "200px" }}
            />
        </div>

        <ul className='flex items-center'>
          <div className='' style={{ position: "relative", display: "inline-block" }}>
            <input
              type="date"
              onChange={(e) => {
                setFilterDate(e.target.value);
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

          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="Filter by Member Name"
              onChange={(e) => setFilterMemberName(e.target.value)}
              value={filterMemberName}
              className="text-white sm:block hidden ml-2 bg-black appearance-none focus:outline-none pr-10"
              style={{ padding: "10px", borderRadius: "5px", color: "white", border: "1px solid white", width: "200px" }}
            />
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
              navigate('/login_dashboard');
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
              }}
              value={filterDate}
              className="text-white mt-2 sm:hidden block bg-blue-500 appearance-none focus:outline-none pr-10"
              style={{ padding: "10px", borderRadius: "5px", color: "white", border: "1px solid white", width: "200px" }}
            />
      </div>
      <div className="text-center p-4">
        {/* <h2 className="text-2xl font-semibold">Feedback Counts by Team Member for this Month</h2> */}
        <ul>
          {Object.entries(feedbackCounts).map(([memberName, count]) => (
            <li className='text-black' key={memberName}>
              {memberName}: {count} feedback(s)
            </li>
          ))}
        </ul>
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
  );
}
