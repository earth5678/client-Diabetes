import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css'; // Import CSS file
import { UilUsersAlt } from "@iconscout/react-unicons";
import UserCount from './UserCount';
import FoodRec from './FoodRec';
import Fid from './Fid';
import Type1 from './Type1';
import Type2 from './Type2';
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap:'10px' }}>
        <div>
          <UserCount />
        </div>

        <div>
          <FoodRec />
        </div>

        <div>
          <Fid />
        </div>
        <div>
          <Type1 />
        </div>

        <div>
          <Type2 />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
