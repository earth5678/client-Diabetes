import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// ... (other imports)

const MealsTable = () => {
  const [meals, setMeals] = useState([]);
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/meals?userId=${userId}`);
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  // ... (existing code)
};

export default MealsTable;
