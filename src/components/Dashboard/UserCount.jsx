import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css'; // Import CSS file
import { UilUsersAlt } from "@iconscout/react-unicons";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-modal';

// ... (import statements)

const UserCount = () => {
    const [users, setUsers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const paginatorLeft = (
        console.log('Go to first page')
    );

    const paginatorRight = (
        console.log('Go to last page')
    );

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            height: '85%',
            alignItems: 'center',
            backgroundColor: '#DCFFE4'
        },
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
            return `${age} ปี`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const filteredUsers = users.filter((user) =>
    user && !user.isAdmin
  );


    return (
        <div>
            <div
                style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}
                onClick={handlePopupToggle}
            >
                <div className="dashboard-container">
                    <h2>ผู้ใช้งานระบบ</h2>
                    <div className="detail">
                        <UilUsersAlt />
                        <span>{filteredUsers.length}</span>
                        <span>Account</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isPopupOpen}
                style={customStyles}
            >
                <button
                    type="button"
                    onClick={handlePopupClose}
                    style={{ fontFamily: 'Kanit' }}
                >
                    ปิด
                </button>
                <div style={{ maxWidth: '500%', margin: 'auto' }}>
                    <h2 style={{ color: '#52B788', fontSize: '20px', fontFamily: 'Kanit', marginBottom: '5px', padding: '10px' }}>
                        ข้อมูลผู้ใช้
                    </h2>
                    <div className="table-container">
                        <div className="popup">
                            <DataTable value={filteredUsers} paginator rows={8} tableStyle={{ minWidth: '60rem', backgroundColor: '#dff6e2' }}
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
                            </DataTable>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserCount;

