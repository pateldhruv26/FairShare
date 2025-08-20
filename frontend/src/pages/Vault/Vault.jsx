import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar.jsx";
import { API_ENDPOINTS } from '../../config/api';

function Vault({ thememode, toggle, user }) {
  const [fileUpload, setfileUpload] = useState(null);
  const [fileUrls, setfileUrls] = useState([]);


  // Function to format date and time in a user-friendly way
  const formatDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${date} ${time}`;
  };

  // Function to upload file (Firebase storage removed)
  const uploadFile = () => {
    if (fileUpload == null) return;
    alert("File upload functionality is currently disabled. Firebase storage has been removed.");
  };

  // Function to download CSV file (Firebase storage removed)
  const downloadCSV = async (fileName) => {
    alert("File download functionality is currently disabled. Firebase storage has been removed.");
  };

  // Function to fetch user files from the database
  useEffect(() => {
    const getFiles = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_URLS(user._id));
        console.log(res.data);
        setfileUrls(res.data.files);
      } catch (err) {
        console.log(err);
      }
    };
    getFiles();
  }, []);

  const convertFileName=(filename)=>{
      const strings=filename.split(" ");
      const k=new Date(strings[1]).toLocaleString();
      
      const obj= {first:strings[0],second:k};

      return obj;
  }

  return (
    <div className="h-full" style={{ backgroundColor: thememode === 'dark' ? '#181818' : '#f0f0f0' }}>
      <Navbar thememode={thememode} toggle={toggle} />

      <div className="dark:text-white h-screen">
        <div className='font-extrabold text-2xl mx-4 mt-4 dark:text-[#f0f0f0]'>Storage Vault</div>
        <div className="flex justify-between">
          <div className='mx-4 text-gray-600 dark:text-gray-400'>
            Export Transaction data with filters of your choice and upload them here in the vault
          </div>
          <div className="flex justify-end mx-4">
            <label htmlFor="actual-btn" className="text-white rounded-md p-2 bg-[#000080] mx-1 cursor-pointer">
              Choose File
            </label>
            <input
              type="file"
              id="actual-btn"
              className="w-60 flex justify-center align-middle mx-2 border-none hidden"
              onChange={(event) => { setfileUpload(event.target.files[0]); }}
            />
            <button onClick={uploadFile} className="text-white rounded-md p-2 bg-[#000080]">
              Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 dark:bg-[#181818] m-4">
          {fileUrls.map((file) => {
            
            const {first,second}=convertFileName(file.fileName);
            return (
                <div key={file.fileName}>
                  <div
                    className="m-2 max-w-[400px] h-[100px] w-82 h-34 rounded-md shadow-md font-semibold px-2 py-2 border-1 border-black border-dashed flex align-middle justify-center cursor-pointer"
                    style={{
                      color: thememode === "dark" ? "white" : "black",
                      backgroundColor: thememode === "dark" ? "#282828" : "white",
                      borderColor: thememode === "dark" ? "white" : "black",
                    }}
                    alt={file.fileName}
                    onClick={() => downloadCSV(file.fileName)}
                  >
                    <img src="folder.png" className="h-20 w-20" alt="Folder Icon" />
                    <div className="p-3">
                        <div className="font-bold">{first}</div>
                        <div className="text-sm">{second}</div>
                    </div>
                  </div>
                </div>
            )
          })}
        </div> 
      </div>
    </div>
  );
}

export default Vault;