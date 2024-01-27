import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css'; // Import CSS file
import { UilUsersAlt } from "@iconscout/react-unicons";

const UserCount = () => {
  const [allUsers, setAllUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterUsersByDiabetesType = (diabetesType) => {
    return allUsers.filter(user => user.diabetesType === diabetesType);
  };

  const diabetesType1Users = filterUsersByDiabetesType('ประเภทที่ 2');

  return (
    <div>
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <div className="dashboard4-container">
          <h2>เบาหวานประเภทที่ 2</h2>
          <div className="detail">
            <UilUsersAlt />
            <span>{diabetesType1Users.length}</span>
            <span>Account</span>
          </div>
        </div>
      </div>
    </div>    
  );
};

export default UserCount;
