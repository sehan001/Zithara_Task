// App.js
import React, { useState, useEffect } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { FaSort } from "react-icons/fa";
import nodatafoundgif from "./assets/nodatafound.gif";
import axios from "axios";
import Table from "./Table";

function App() {
  const [isLight, setIsLight] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/customers")
      .then((response) => {
        console.log(response.data.rows);
        const modifiedData = response.data.rows.map((row) => ({
          ...row,
          created_at: new Date(row.created_at),
        }));
        setData(modifiedData);
        // Do not set filteredData here
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [isDateAsc, setIsDateAsc] = useState(false);
  const [isTimeAsc, setIsTimeAsc] = useState(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleFilter = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredItems = data.filter(
      (item) =>
        item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.location.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredData(filteredItems);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (type) => {
    const newData = [...filteredData];
    let isAscending = true;
    if (type === "date") {
      isAscending = isDateAsc;
      newData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sort by date
    } else if (type === "time") {
      isAscending = isTimeAsc;
      newData.sort((a, b) => {
        const timeA = a.created_at.getHours() * 60 + a.created_at.getMinutes();
        const timeB = b.created_at.getHours() * 60 + b.created_at.getMinutes();
        return timeA - timeB;
      });
    }
    if (!isAscending) {
      newData.reverse();
    }

    if (type === "date") {
      setIsDateAsc(!isDateAsc);
    } else if (type === "time") {
      setIsTimeAsc(!isTimeAsc);
    }
    setFilteredData(newData);
  };

  const toggle = () => {
    if (isLight) {
      document.body.style.background = "black";
      document.body.style.color = "white";
    } else {
      document.body.style.background = "white";
      document.body.style.color = "black";
    }
    setIsLight(!isLight);
  };

  return (
    <div className="" id="main">
      <div className="flex justify-between p-5 bg-green-100">
        <div className="text-2xl font-bold text-black">
          Customer Database Management
        </div>
        <div
          onClick={toggle}
          className=" text-4xl hover:cursor-pointer rounded-full text-black"
        >
          {!isLight && <CiLight />}
          {isLight && <CiDark />}
        </div>
      </div>
      <Table
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        currentData={currentData}
        isLight={isLight}
        handleFilter={handleFilter}
        handleSort={handleSort}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
}

export default App;
