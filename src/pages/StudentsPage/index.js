import React, { useEffect, useState } from "react";
import "./index.css";
import { Table, Pagination, notification, message, Modal, Button } from 'antd';
import axios from "axios";

const StudentsPage = () => {
  const [studentList, setStudentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [userDetails, setUserDetails] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { title: 'Roll Number', dataIndex: 'rollnumber', key: 'rollnumber' },
    { title: 'Hindi', dataIndex: 'hindi', key: 'hindi' },
    { title: 'English', dataIndex: 'english', key: 'english' },
    { title: 'Math', dataIndex: 'maths', key: 'maths' },
    { title: 'Science', dataIndex: 'science', key: 'science' },
    { title: 'Total Marks', dataIndex: 'totalMarks', key: 'totalMarks' },
    { title: 'Marks Scored', dataIndex: 'marksScored', key: 'marksScored' },
    { title: 'Avg', dataIndex: 'avgMarks', key: 'avgMarks' },
    {
      title: 'See Teacher Details',
      key: 'teacherDetails',
      render: (_, record) => (
        <Button type="link" onClick={() => showTeacherDetails()}>
          View Teacher
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios.get(`/ims/userDetails?signupId=${userId}`)
      .then((res) => {
        setUserDetails(res.data);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("rollnumber", res.data.rollnumber);
        localStorage.setItem("studyingClass", res.data.studyingclass);
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    const { rollnumber, studyingclass } = userDetails;
    axios.get(`/ims/marks/getMarks?rollnumber=${rollnumber}&studyingclass=${studyingclass}`)
      .then((res) => {
        const fetchedLists = res.data.map((item, index) => {
          const marksScored = item.hindi + item.english + item.maths + item.science;
          return {
            key: index + 1,
            rollnumber: item.rollnumber,
            hindi: item.hindi,
            english: item.english,
            maths: item.maths,
            science: item.science,
            totalMarks: 400,
            marksScored,
            avgMarks: (marksScored / 4).toFixed(2),
          };
        });

        setStudentList(fetchedLists);
        notification.success({ message: "Marks loaded successfully!" });
      })
      .catch((err) => {
        message.error("Failed to load marks.");
        console.error("Error fetching marks:", err);
      });
  }, [userDetails]);

  const showTeacherDetails = () => {
    if (!userDetails) return;
    
    const { studyingclass } = userDetails;
    axios.get(`/ims/teacherDetails?role=2&studyingclass=${studyingclass}`)
      .then((res) => {
        setTeacherDetails(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => console.error("Error fetching teacher details:", err));
  };

  return (
    <div className="task-table-container">
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
        onChange={setCurrentPage}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      {/* Teacher Details Modal */}
      <Modal
        title="Teacher Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {teacherDetails ? (
          <div>
            <p><strong>Name:</strong> {teacherDetails.firstName} {teacherDetails.lastName}</p>
            <p><strong>Email:</strong> {teacherDetails.email}</p>
            <p><strong>Mobile:</strong> {teacherDetails.mobile}</p>
          </div>
        ) : (
          <p>Loading teacher details...</p>
        )}
      </Modal>
    </div>
  );
};

export default StudentsPage;
