import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, notification, message } from 'antd';
import './index.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ScoreCard = ({ userId }) => {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const columns = [
    {
      title: 'Roll Number',
      dataIndex: 'rollnumber',
      key: 'rollnumber',
    },
    {
      title: 'Hindi',
      dataIndex: 'hindi',
      key: 'hindi',
    },
    {
      title: 'English',
      dataIndex: 'english',
      key: 'english',
    },
    {
      title: 'Math',
      dataIndex: 'maths',
      key: 'maths',
    },
    {
      title: 'Science',
      dataIndex: 'science',
      key: 'science',
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
      key: 'totalMarks',
    },
    {
      title: 'Marks Scored',
      dataIndex: 'marksScored',
      key: 'marksScored',
    },
    {
      title: 'Avg',
      dataIndex: 'avgMarks',
      key: 'avgMarks',
    },
  ];

  useEffect(() => {
    const studyingclass = localStorage.getItem('studyingClass');
    axios
      .get(`/ims/marks/getMarks?studyingclass=${studyingclass}`)
      .then((res) => {
        const fetchedLists = res.data.map((item, index) => {
          const marksScored = item.hindi + item.english + item.maths + item.science;
          const avgMarks = (marksScored / 4).toFixed(2);
          return {
            key: `${index + 1}`,
            rollnumber: item.rollnumber,
            hindi: item.hindi,
            english: item.english,
            maths: item.maths,
            science: item.science,
            totalMarks: 400,
            marksScored: marksScored,
            avgMarks: avgMarks,
          };
        });
  
        setStudentList(fetchedLists);
        notification.success({
          message: "Marks loaded successfully!",
        });
      })
      .catch((err) => {
        console.log('checking error: ' + err);
        message.error("Failed to load marks list.");
        console.error(err);
      });
  }, [userId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="task-table-container">
      <div className="task-table-header">
        <Button type="primary" onClick={() => navigate("/scoreCard")}>
          Score Card
        </Button>
      </div>
      <Table
        dataSource={studentList.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pagination={false}
        className="task-table"
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={studentList.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: 'right' }}
      />
    </div>
  );
};

export default ScoreCard;
