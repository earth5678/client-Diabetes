import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css'; // Import CSS file
import { UilUsersAlt } from "@iconscout/react-unicons";

const FoodRec = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/foods');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
      <div className="dashboard1-container">
        <h2>อาหารที่แนะนำ</h2>
        <div className="detail">
          <UilUsersAlt />
          <span>{users.length}</span>
          <span>รายการ</span>
        </div>
      </div>
      </div>
      </div>    
  );
};

export default FoodRec;
