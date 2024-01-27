import React, { useState } from 'react';
import axios from 'axios';
import './styles.module.css';

const defaultImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

const AddUser = ({ onAddUser }) => {
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    image: defaultImage,
    dateOfBirth: '',
    weight: '',
    height: '',
    diabetesType: '',
    challengeCalorie: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/users/add`, newUserData);
      console.log(response.data);

      setNewUserData({
        fullName: '',
        email: '',
        password: '',
        image: defaultImage,
        dateOfBirth: '',
        weight: '',
        height: '',
        diabetesType: '',
        challengeCalorie: ''
      });

      if (onAddUser) {
        onAddUser(response.data);
      }
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error.message);
      // Handle error gracefully, show a message to the user, etc.
    }
  };


  return (
    <div className="AddFoodForm">
      <h2>เพิ่มผู้ใช้งาน</h2>
      <form>
        <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
          ชื่อ-นามสกุล
          <input
            type="text"
            name="fullName"
            value={newUserData.fullName}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
        </label>
        <label>
          อีเมล
          <input
            type="text"
            name="email"
            value={newUserData.email}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
          />
        </label>
        <label>
          รหัสผ่าน
          <input
            type="password"
            name="password"
            value={newUserData.password}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
          />
        </label>

        <label>
          วัน เดือน ปี เกิด
          <input
            type="date"
            name="dateOfBirth"
            value={newUserData.dateOfBirth}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
          />
        </label>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            <label style={{ display: 'block', fontFamily: 'Kanit' }}>
              น้ำหนัก
              <input
                type="text"
                name="weight"
                value={newUserData.weight}
                onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
              />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontFamily: 'Kanit' }}>
              ส่วนสูง
              <input
                type="text"
                name="height"
                value={newUserData.height}
                onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
              />
            </label>
          </div>
        </div>

        <label>
          ประเภทเบาหวาน
          <input
            type="text"
            name="diabetesType"
            value={newUserData.diabetesType}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
          />
        </label>
        <label>
          เป้าหมายแคลอรี่ต่อวัน
          <input
            type="text"
            name="challengeCalorie"
            value={newUserData.challengeCalorie}
            onChange={handleInputChange}
            style={{ marginTop: '2px', padding: '4px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }}
          />
        </label>

        <button type="button" onClick={addUser}>
          เพิ่มผู้ใช้
        </button>
      </form>
    </div>
  );
};

export default AddUser;
