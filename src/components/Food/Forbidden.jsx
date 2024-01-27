import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddForbidden from './AddForbidden';
import Modal from 'react-modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function Forbidden() {
  const [data, setData] = useState([]);
  const [editForbiddenData, setEditForbiddenData] = useState({
    foodName: '',
    foodImage: '',
    foodDetail: '',
  });
  const [editForbiddenId, setEditForbiddenId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleEdit = async () => {
    try {
      const url = `http://localhost:8080/forbidden/${editForbiddenId}`;
      const response = await axios.put(url, editForbiddenData);
      console.log(response.data);
      setEditForbiddenId(null);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  const handleDelete = async (rowData) => {
    const confirmDeletion = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการอาหารนี้');

    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8080/forbidden/${rowData._id}`);
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error('Error deleting food:', error.response ? error.response.data : error.message);
    }
  };

  const editForbidden = (forbidden) => {
    setEditForbiddenId(forbidden._id);
    setEditForbiddenData({
      foodName: forbidden.foodName,
      foodImage: forbidden.foodImage,
      foodDetail: forbidden.foodDetail,
    });
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setEditForbiddenId(null);
    setEditForbiddenData({
      foodName: '',
      foodImage: '',
      foodDetail: '',
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForbiddenData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFoods = data.filter((data) =>
    data.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: '50%',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%', // Adjusted width for better responsiveness
      height: '80%',
      alignItems: 'center',
      backgroundColor: '#DCFFE4',
    },
  };

  return (
    <div>
      <h1>ข้อมูลอาหารที่ควรงด</h1>

      <div className="search-container">
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="ค้นหา"
          style={{
            width: '20%',
            padding: '5px',
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '50px',
            fontFamily: 'Kanit',
            marginBottom: '2px',
          }}
        />
      </div>

      <div className="container">
        <div className="table-container">
          <DataTable
            value={filteredFoods}
            paginator
            rows={2}
            tableStyle={{ minWidth: '60rem', backgroundColor: '#dff6e2' }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
          >
            <Column
              field="foodImage"
              header="รูปภาพ"
              style={{ width: '20%' }}
              body={(rowData) => (
                <img
                  src={rowData.foodImage}
                  alt="Food Image"
                  style={{ width: '50%', height: 'auto', borderRadius: '5px' }}
                />
              )}
            />
            <Column field="foodName" header="ชื่ออาหาร" style={{ width: '15%' }}></Column>
            <Column field="foodDetail" header="รายละเอียด" style={{ width: '30%' }}></Column>
            <Column
              header="การจัดการ"
              body={(rowData) => (
                <div style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => editForbidden(rowData)}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDelete(rowData)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}
              style={{ width: '10%', textAlign: 'center' }}
            ></Column>
          </DataTable>
        </div>

        <div className="button-info-containerUser">
          <AddForbidden fetchData={fetchData} />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelEdit}
        style={customStyles}
        contentLabel="Edit Food Modal"
      >
        <div style={{ maxWidth: '340px', margin: 'auto' }}>
          <h2 style={{ color: '#52B788', fontSize: '20px', fontFamily: 'Kanit', marginBottom: '5px' , padding:'10px'}}>
            แก้ไขข้อมูลอาหาร
          </h2>

          <form style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <label
                style={{
                  margin: '5px',
                  width: '200%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  fontFamily: 'Kanit',
                }}
              >
                อาหารที่ควรงด
              </label>
              <input
                type="text"
                name="foodName"
                value={editForbiddenData.foodName}
                onChange={handleInputChange}
                style={{
                  width: '150%',
                  height: '20px',
                  marginTop: '2px',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #52B788',
                  fontFamily: 'Kanit',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  margin: '5px',
                  width: '200%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  fontFamily: 'Kanit',
                }}
              >
                รายละเอียด
              </label>
              <textarea
                type="text"
                name="foodDetail"
                value={editForbiddenData.foodDetail}
                onChange={handleInputChange}
                style={{
                  marginTop: '1px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '2px solid #52B788',
                  fontFamily: 'Kanit',
                  width: '150%',
                  height: '200px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  margin: '5px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  fontFamily: 'Kanit',
                }}
              >
                รูปภาพ
              </label>
              <input
                type="text"
                name="foodImage"
                value={editForbiddenData.foodImage}
                onChange={handleInputChange}
                style={{
                  marginTop: '2px',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #52B788',
                  fontFamily: 'Kanit',
                  width: '150%',
                  height: '20px',
                }}
              />
            </div>
            <div style={{ width: '90%', marginTop: '10px', fontFamily: 'Kanit' }}>
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  width: '160%',
                  height: '40px',
                  padding: '10px',
                  backgroundColor: '#52B788',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'Kanit',
                  border: '1px solid #FFFFFF',
                  marginTop : '20px',
                }}
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  width: '160%',
                  height: '40px',
                  marginTop: '5px',
                  padding: '10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'Kanit',
                  border: '1px solid #FFFFFF',
                }}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Forbidden;
