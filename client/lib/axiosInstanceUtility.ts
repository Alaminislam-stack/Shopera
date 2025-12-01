import axios from "axios"; 


const axiosInstanceUtility = axios.create({
  baseURL : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    ContentType: "application/json",
  }, 
});

export default axiosInstanceUtility;