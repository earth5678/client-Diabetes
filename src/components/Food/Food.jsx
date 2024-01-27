import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Food.css';
import Addfood from './AddFood';
import Modal from 'react-modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const FoodDataTable = () => {
  const [foods, setFoods] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    FoodName: '',
    FoodCalorie: '',
    FoodProtein: '',
    FoodFat: '',
    FoodCarbo: '',
    FoodFiber: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/foods');
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateFoods = async () => {
    try {
      const url = `http://localhost:8080/foods/${editingUserId}`;
      const response = await axios.put(url, editedUserData);
      console.log(response.data);
      setEditingUserId(null);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteFoods = async (id) => {
    const confirmDeletion = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการอาหารนี้');

    if (!confirmDeletion) {
      return;
    }

    try {
      const url = `http://localhost:8080/foods/${id}`;
      await axios.delete(url);

      // Trigger a refetch of the data
      fetchData();

      console.log('Food item deleted successfully');
    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };

  const editUser = (user) => {
    setEditingUserId(user._id);
    setEditedUserData({
      FoodName: user.FoodName,
      FoodCalorie: user.FoodCalorie,
      FoodProtein: user.FoodProtein,
      FoodFat: user.FoodFat,
      FoodCarbo: user.FoodCarbo,
      FoodFiber: user.FoodFiber,
    });
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedUserData({
      FoodName: '',
      FoodCalorie: '',
      FoodProtein: '',
      FoodFat: '',
      FoodCarbo: '',
      FoodFiber: '',
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFoods = foods.filter((food) =>
    food.FoodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '25%',
      height: '85%',
      alignItems: 'center',
      backgroundColor: '#DCFFE4'
    },
  };

  return (
    <div>
      <h1>ข้อมูลอาหารและปริมาณที่แนะนำ</h1>

      <div className="search-container">
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="ค้นหา"
          style={{ width: '20%', padding: '5px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '50px', fontFamily: 'Kanit', marginBottom: '2px', }}
        />
      </div>

      <div className="container">

        <div className="table-container">
          <DataTable
            value={filteredFoods}
            paginator
            rows={10}
            tableStyle={{ minWidth: '60rem', backgroundColor: '#dff6e2' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
          >
            <Column field="FoodName" header="เมนู" style={{ width: '20%' }}></Column>
            <Column field="FoodCalorie" header="แคลอรี่ (kl)" style={{ width: '10%' }}></Column>
            <Column field="FoodProtein" header="โปรตีน (g)" style={{ width: '10%' }}></Column>
            <Column field="FoodFat" header="ไขมัน (g)" style={{ width: '10%' }}></Column>
            <Column field="FoodCarbo" header="คาร์โบ..(g)" style={{ width: '10%' }}></Column>
            <Column field="FoodFiber" header="ไฟเบอร์ (g)" style={{ width: '10%' }}></Column>
            <Column
              header="การจัดการ"
              body={(rowData) => (
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faEdit} onClick={() => editUser(rowData)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => deleteFoods(rowData._id)} style={{ cursor: 'pointer' }} />
                </div>
              )}
              style={{ width: '15%', textAlign: 'center' }}
            ></Column>
          </DataTable>
        </div>
        <div className="button-info-containerUser">
          <Addfood />
        </div>
      </div>


      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelEdit}
        style={customStyles}
        contentLabel="Edit User Modal">

        <div style={{ maxWidth: '200px', margin: 'auto' }}>
          <h2 style={{ color: '#52B788', fontSize: '20px', fontFamily: 'Kanit', marginBottom: '5px' }}>
            แก้ไขข้อมูลอาหาร
          </h2>

          <form style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
            <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>เมนู</label>
              <input type="text" name="FoodName" value={editedUserData.FoodName} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>
            <div>
              <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>แคลอรี่ (กิโลแคลอรี่)</label>
              <input type="text" name="FoodCalorie" value={editedUserData.FoodCalorie} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>
            <div>
              <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>โปรตีน (กรัม)</label>
              <input type="text" name="FoodProtein" value={editedUserData.FoodProtein} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>

            <div>
              <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>ไขมัน (กรัม)</label>
              <input type="text" name="FoodFat" value={editedUserData.FoodFat} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>
            <div>
              <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>คาร์โบไฮเดรต (กรัม)</label>
              <input type="text" name="FoodCarbo" value={editedUserData.FoodCarbo} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>
            <div>
              <label style={{ margin: '5px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>ไฟเบอร์ (กรัม)</label>
              <input type="text" name="FoodFiber" value={editedUserData.FoodFiber} onChange={handleInputChange}
                style={{ marginTop: '2px', padding: '8px', borderRadius: '5px', border: '1px solid #52B788', fontFamily: 'Kanit' }} />
            </div>

            <div style={{ width: '90%', marginTop: '10px', fontFamily: 'Kanit', }}>
              <button
                type="button"
                onClick={updateFoods}
                style={{ width: '100%', padding: '10px', backgroundColor: '#52B788', color: 'white', borderRadius: '5px', cursor: 'pointer', fontFamily: 'Kanit', border: '1px solid #FFFFFF' }}
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                style={{ width: '100%', marginTop: '5px', padding: '10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '5px', cursor: 'pointer', fontFamily: 'Kanit', border: '1px solid #FFFFFF' }}
              >
                ยกเลิก
              </button>
            </div>

          </form>
        </div>
      </Modal>


    </div>
  );
};

export default FoodDataTable;