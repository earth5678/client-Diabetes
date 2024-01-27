import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

  const MealsTable = () => {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
  
    useEffect(() => {
      fetch('http://localhost:8080/meals')
        .then(response => response.json())
        .then(data => {
          setMeals(data);
          setFilteredMeals(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    const formatSimpleDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
      return formattedDate;
    };
  
    const handleSearch = () => {
      const lowerCaseName = searchName ? searchName.toLowerCase() : '';
      const formattedDate = searchDate ? formatSimpleDate(searchDate).toLowerCase() : '';
    
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
    
      const filteredData = meals.filter((meal) => {
        const mealDate = new Date(meal.Date);
    
        return (
          (meal.fullName && meal.fullName.toLowerCase().includes(lowerCaseName)) || !searchName &&
          (mealDate >= sevenDaysAgo && mealDate <= currentDate) || !searchDate
        );
      });
    
      setFilteredMeals(filteredData);
    };
    
  return (
    <div>
      <h1>ข้อมูลผู้ใช้งาน</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="ค้นหา ชื่อ"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={handleSearch}>ค้นหา</button>
      </div>

        <div className="search-container">
          <div className="table-container">
            <DataTable
              value={filteredMeals}
              paginator
              rows={7}
              tableStyle={{ minWidth: '60rem', backgroundColor: '#dff6e2' }}
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
            >
              <Column field="Date" header="วันที่" body={(rowData) => formatSimpleDate(rowData.Date)} style={{ width: '15%' }}></Column>
              <Column field="fullName" header="ชื่อ-สกุล" style={{ width: '18%' }}></Column>
              <Column field="SumCalorie" header="แคลอรี่รวม 1 วัน" style={{ width: '17%' }}></Column>
              <Column field="BName" header="อาหารเช้า" style={{ width: '12%' }}></Column>
              <Column field="Bcalories" header="" style={{ width: '5' }}></Column>
              <Column field="LName" header="อาหารกลางวัน" style={{ width: '15%' }}></Column>
              <Column field="Lcalories" header="" style={{ width: '5%' }}></Column>
              <Column field="DName" header="อาหารเย็น" style={{ width: '15%' }}></Column>
              <Column field="Dcalories" header="" style={{ width: '5%' }}></Column>
            </DataTable>
          </div>
        </div>
      </div>
      
      );
};

export default MealsTable;
