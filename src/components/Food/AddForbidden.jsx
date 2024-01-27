import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Food.css';

const AddForbidden = () => {
  const [newForbidden, setNewForbidden] = useState({
    foodName: '',
    foodImage: '',
    foodDetail: '',
  });

  const AddForbidden = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/forbidden`, newForbidden);
      console.log(response.data);

      setNewForbidden({
        foodName: '',
        foodImage: '',
        foodDetail: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error adding food:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewForbidden((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/forbidden');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [data, setData] = useState([]);

  return (
    <div>
      <div className="AddFoodForm">
        <form>
          <h2>เพิ่มรายการอาหารที่ควรงด</h2>
          <label>อาหารที่ควรงด</label>
          <input
            type="text"
            name="foodName"
            value={newForbidden.foodName}
            onChange={handleInputChange}
            style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }}
          />

          <label>รายละเอียด</label>
          <textarea
            value={newForbidden.foodDetail}
            onChange={handleInputChange}
            name="foodDetail"
            style={{
              marginTop: '1px',
              padding: '5px',
              borderRadius: '5px',
              border: '2px solid #52B788',
              fontFamily: 'Kanit',
              width: '100%',
              height: '170px',
            }}
          />

          <label>รูปภาพ</label>
          <input
            type="text"
            name="foodImage"
            value={newForbidden.foodImage}
            onChange={handleInputChange}
            style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }}
          />

          <button type="button" onClick={AddForbidden}>
            เพิ่มรายการ
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddForbidden;
