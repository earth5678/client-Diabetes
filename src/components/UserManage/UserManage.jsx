import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AddUser from './AddUser';
import './styles.module.css';


const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  const [editedUserData, setEditedUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    weight: '',
    height: '',
    dateOfBirth: '',
    diabetesType: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleAddUser = (addedUserData) => {
    closeAddUserModal();
    fetchData(); // Fetch updated user data
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  const updateUser = async () => {
    try {
      const url = `http://localhost:8080/api/users/${editingUserId}`;
      const response = await axios.put(url, editedUserData);
      // Handle the response as needed
      console.log(response.data);
      setEditingUserId(null);
      setIsModalOpen(false);
      fetchData(); // Fetch updated user data
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDeletion) {
      return;
    }
    try {
      const url = `http://localhost:8080/api/users/${userId}`;
      const response = await axios.delete(url);
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const editUser = (user) => {
    setEditingUserId(user._id);
    setEditedUserData({
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      weight: user.weight,
      height: user.height,
      dateOfBirth: user.dateOfBirth,
      diabetesType: user.diabetesType,
    });
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedUserData({
      fullName: '',
      email: '',
      weight: '',
      height: '',
      dateOfBirth: '',
      diabetesType: '',
      password: ','
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const monthNameToNumber = (monthName) => {
    const months = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
    return months[monthName] || monthName;
  };
  const formatDateWithAge = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = monthNameToNumber(
        new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
      );
      const year = date.getFullYear();

      // Calculate age
      const today = new Date();
      const birthDate = new Date(year, month - 1, day); // Month is 0-indexed
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      // const ageSum =  `${day}-${month}-${year} (อายุ ${age} ปี)`
      return `${age} ปี`;

    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };


  const paginatorLeft = (
    console.log('Go to first page')
  );

  const paginatorRight = (
    console.log('Go to last page')
  );

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const filteredUsers = users.filter((user) =>
    user &&
    user.fullName &&
    typeof user.fullName === 'string' &&
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !user.isAdmin
  );

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div>
      <h1>ข้อมูลผู้ใช้งาน</h1>
      <div className="search-container">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="ค้นหา"
            style={{
              width: '25%',
              padding: '5px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '50px',
              fontFamily: 'Kanit',
              marginBottom: '2px',
              paddingRight: '20px'
            }}
          />
          {searchQuery && (
            <FontAwesomeIcon
              icon={faTimesCircle}
              onClick={handleClearSearch}
              style={{
                cursor: 'pointer',
                fontSize: '25px',
                color: '#ccc',
              }}
            />
          )}
        </div>
      </div>

      <div className="container">
        <div className="table-container">

          <DataTable value={filteredUsers} paginator rows={10} tableStyle={{ minWidth: '60rem', backgroundColor: '#dff6e2' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
            <Column field="fullName" header="ชื่อ-สกุล" style={{ width: '20%' }}></Column>
            <Column field="email" header="อีเมล" style={{ width: '30%' }}></Column>
            <Column field="weight" header="น้ำหนัก" style={{ width: '7%' }}></Column>
            <Column field="height" header="ส่วนสูง" style={{ width: '7%' }}></Column>
            <Column field="dateOfBirth" header="อายุ"
              body={(rowData) => formatDateWithAge(rowData.dateOfBirth)}
              style={{ width: '10%' }}
            ></Column>

            <Column field="diabetesType" header="เบาหวาน" style={{ width: '15%' }}></Column>
            <Column
              header="การจัดการ"
              body={(rowData) => (
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faEdit} onClick={() => editUser(rowData)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                  <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(rowData._id)} style={{ cursor: 'pointer' }} />
                </div>
              )}
              style={{ width: '15%', textAlign: 'center' }} // Center align the content
            ></Column>
          </DataTable>
        </div>
        
        <div>
          <AddUser />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelEdit}
        contentLabel="Edit User Modal"
        style={customStyles}>

        <div style={{ maxWidth: '200px', margin: 'auto' }}>
          <h2 style={{ color: '#52B788', fontSize: '20px', fontFamily: 'Kanit', marginBottom: '5px' }}>
            แก้ไขข้อมูลส่วนตัวผู้ใช้
          </h2>
          <form style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              ชื่อ-สกุล
              <input
                type="text"
                name="fullName"
                value={editedUserData.fullName}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>
            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              อีเมล
              <input
                type="text"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>

            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              รหัสผ่าน
              <input
                type="text"
                name="password"
                value={editedUserData.password}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>

            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              น้ำหนัก
              <input
                type="text"
                name="weight"
                value={editedUserData.weight}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>
            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              ส่วนสูง
              <input
                type="text"
                name="height"
                value={editedUserData.height}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>
            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              วัน เดือน ปี เกิด
              <input
                type="date"
                name="dateOfBirth"
                value={editedUserData.dateOfBirth}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit', width: '80%' }}
              />
            </label>
            <label style={{ margin: '1px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', fontFamily: 'Kanit' }}>
              เบาหวาน
              <input
                type="text"
                name="diabetesType"
                value={editedUserData.diabetesType}
                onChange={handleInputChange}
                style={{ marginTop: '1px', padding: '8px', borderRadius: '5px', border: '1px solid #3498db', fontFamily: 'Kanit' }}
              />
            </label>

            <div style={{ width: '90%', marginTop: '10px', fontFamily: 'Kanit', }}>
              <button
                type="button"
                onClick={updateUser}
                style={{ width: '90%', padding: '10px', backgroundColor: '#52B788', color: 'white', borderRadius: '5px', cursor: 'pointer', fontFamily: 'Kanit' }}
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                style={{ width: '90%', marginTop: '5px', padding: '10px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '5px', cursor: 'pointer', fontFamily: 'Kanit' }}
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

export default UserManage;