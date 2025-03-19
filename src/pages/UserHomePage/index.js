import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Pagination, Modal, Form, notification, message } from 'antd';
import './index.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UserHomePage = ({ userId }) => {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState(null);

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollnumber',
      key: 'rollnumber',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text, record) => <a onClick={() => handleEdit(record)}>Add Marks</a>,
    },
  ];

  useEffect(() => {
    const role=parseInt(localStorage.getItem('userRole'), 10);
    console.log('cehck', role);
    setUserRole(role);
    if (role === 3) {
      navigate('/studentsPage');
    }
    let userRol = role === 2 ? 3 : null;
    const studyingclass=localStorage.getItem('studyingClass');
    axios
      .get(`/ims/getStudentList?role=${userRol}&studyingclass=${studyingclass}`)
      .then((res) => {
        const fetchedLists = res.data.map((item, index) => ({
          key: `${index + 1}`,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          mobile: item.mobile,
          rollnumber: item.rollnumber,
        }));
  
        setStudentList(fetchedLists);
        notification.success({
          message: "Student List loaded successfully!",
        });
      })
      .catch((err) => {
        console.log('checking error: ' + err);
        message.error("Failed to load Student List.");
        console.error(err);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const handleAddMask = () => {
    const studyingclass=localStorage.getItem('studyingClass');
    form.validateFields().then((values) => {
      axios.post('/ims/marks/add', {
        rollnumber: values.rollNumber,
        hindi: values.hindi,
        english: values.english,
        maths: values.maths,
        science: values.science,
        studyingclass: studyingclass,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((res) => {
        console.log('checking res', res);
        notification.success({
          message: `Marks Added - ${res.data}`,
        });
      })
      .catch((err) => {
        console.log('checking err', err);
              const errorMessage = err.response?.data || "Failed to add marks.";
              notification.error({
                message: "Marks addition Failed!",
                description: errorMessage,
                duration: 0,
              });
      });
      form.resetFields();
      setIsModalOpen(false);
    });
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    form.setFieldsValue({
      rollNumber: item.rollnumber
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  return (
    <div className="task-table-container">
    {
      userRole === 2 && (
        <div className="task-table-header">
        <Button type="primary" onClick={() => navigate("/scoreCard")}>
          Score Card
        </Button>
      </div>
      )
    }
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


      <Modal
        title={"Add Marks"}
        visible={isModalOpen}
        onOk={handleAddMask}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="rollNumber"
            label="Roll Number"
            rules={[{ required: true, message: 'Please fill the Roll number!' }]}
          >
            <Input disabled={isEditMode} />
          </Form.Item>
          <Form.Item
            name="hindi"
            label="Hindi"
            rules={[{ required: true, message: 'Please enter the marks!' }]}
          >
            <Input maxLength={2}/>
          </Form.Item>
          <Form.Item
            name="english"
            label="English"
            rules={[{ required: true, message: 'Please select the priority!' }]}
          >
            <Input maxLength={2}/>
          </Form.Item>
          <Form.Item
            name="maths"
            label="Maths"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Input maxLength={2}/>
          </Form.Item>
          <Form.Item
            name="science"
            label="Science"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input maxLength={2}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserHomePage;
