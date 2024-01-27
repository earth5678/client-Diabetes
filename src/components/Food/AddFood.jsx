import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Food.css';

const AddFoodForm = () => {
  const defaultImage = 'https://img.pikbest.com/png-images/qianku/seafood-gourmet-hot-pot-cartoon-design_2383291.png!sw800';
  const [newFoodData, setNewFoodData] = useState({
    FoodName: '',
    FoodCalorie: '',
    FoodProtein: '',
    FoodFat: '',
    FoodCarbo: '',
    FoodFiber: '',
    FoodImage: defaultImage,
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFoodData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/foods`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addFood = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/foods`, newFoodData);
      console.log(response.data);

      setNewFoodData({
        FoodName: '',
        FoodCalorie: '',
        FoodProtein: '',
        FoodFat: '',
        FoodCarbo: '',
        FoodFiber: '',
        FoodImage: defaultImage,
      });
      fetchData();
      setShowSuccessAlert(true);
      

    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error.message);
    }
  };


  return (
    <div>
      <div className="AddFoodForm">
        <form>
          <h2>เพิ่มรายการอาหาร</h2>
          <label>เมนู</label>
          <input type="text" name="FoodName" value={newFoodData.FoodName} onChange={handleInputChange}
           style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }} />

          <label>แคลอรี่ (กิโลแคลอรี่)</label>
          <input type="text" name="FoodCalorie" value={newFoodData.FoodCalorie} onChange={handleInputChange}
          style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }}
           />

          <label>โปรตีน (กรัม)</label>
          <input type="text" name="FoodProtein" value={newFoodData.FoodProtein} onChange={handleInputChange}
          style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }} />

          <label>ไขมัน (กรัม)</label>
          <input type="text" name="FoodFat" value={newFoodData.FoodFat} onChange={handleInputChange}
          style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }} />

          <label>คาร์โบไฮเดรต (กรัม)</label>
          <input type="text" name="FoodCarbo" value={newFoodData.FoodCarbo} onChange={handleInputChange}
          style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }} />

          <label>ไฟเบอร์ (กรัม)</label>
          <input type="text" name="FoodFiber" value={newFoodData.FoodFiber} onChange={handleInputChange}
          style={{ marginTop: '1px', padding: '5px', borderRadius: '5px', border: '2px solid #52B788', fontFamily: 'Kanit' }} />

          <button type="button" onClick={addFood}>
            เพิ่มรายการ
          </button>

        </form>
      </div>



    </div>
  );
};

export default AddFoodForm;
