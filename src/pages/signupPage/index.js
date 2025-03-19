import React, { useState } from "react";
import "./index.css";
import { Col, Form, Row, Input, Button, Select, message, notification } from "antd";
import {  } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isPrincipal, setIsPrincipal] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [form] = Form.useForm();


  const fetchRole = (value) => {
    console.log("Fetching cities", value);
    if (value === 1) {
      setIsPrincipal(true);
      setIsStudent(false);
    }
    if (value === 2) {
      setIsPrincipal(false);
      setIsStudent(false);
    }
    if (value === 3) {
      setIsStudent(true);
    }
  };

  const handlePinCodeSearch = () => {
    const pinCode = form.getFieldValue("pinCode");
    if (!pinCode) {
      message.error("Please enter a pin code!");
      return;
    }

    axios
      .get(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then((res) => {
        const { PostOffice } = res.data[0];
        form.setFieldsValue({
          country: PostOffice[0].Country,
          state: PostOffice[0].State,
          city: PostOffice[0].District,
        });
        message.success("Location details fetched successfully!");
      })
      .catch(() => {
        message.error("Failed to fetch location details for the given pin code.");
      });
  };

  const onFinish = (values) => {
  console.log('checking values', values);
  const mobileNo = `${values.stdCode}-${values.mobile}`
  console.log('checking mobile No', mobileNo);
    axios
    .post("/ims/signup", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      address: values.address,
      mobile: values.mobile,
      country: values.country,
      state: values.state,
      city: values.city,
      pin: values.pinCode,
      password: values.password,
      role: values.role,
      studyingclass: values.studyingClass,
      rollnumber: values.rollnumber
    })
    .then((res) => {
      console.log('checking res', res.status);
        notification.success({
          message: "Registered successfully!",
          description: res.data,
          duration: 0,
        });
        navigate("/");
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message || "Failed to signup.";
      notification.error({
        message: "Registration Failed!",
        description: errorMessage,
        duration: 0,
      });
    });
  };

  const roles = [
    {
      label: "Principal",
      value: 1,
    },
    {
      label: "Class Teacher",
      value: 2,
    },
    {
      label: "Student",
      value: 3,
    },
  ];

  const classes = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
  ];

  const rollNumbers = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
    {
      value: 6,
    },
    {
      value: 7,
    },
    {
      value: 8,
    },
    {
      value: 9,
    },
    {
      value: 10,
    },
    {
      value: 11,
    },
    {
      value: 12,
    },
    {
      value: 13,
    },
    {
      value: 14,
    },
    {
      value: 15,
    },
  ];


  return (
    <div className="login-containers">
      <div className="left-section">
        <h1>Empowering your child's future with ease and confidence!</h1>
        <p>
          This platform is designed to streamline incident reporting and
          resolution, ensuring a smoother and more efficient workflow for your
          team.
        </p>
      </div>
      <div className="right-section">
        <h2>Sign Up</h2>
        <Form
          className="login-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter your first name" }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter your last name" }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          
              <Form.Item
                name="mobile"
                label="Mobile"
                rules={[{ required: true, message: "Please enter your mobile number" }]}
              >
                <Input
                  placeholder="Mobile"
                  maxLength={10}
                />
              </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select your role" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Role"
                  onChange={(value) => fetchRole(value)}
                >
                  {roles.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {!isPrincipal && (
                <Form.Item
                  name="studyingClass"
                  label="Class"
                  rules={[{ required: true, message: "Please select your city" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Class"
                    // onChange={(value) => fetchCities(value)}
                  >
                    {classes.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              {isStudent && (
                <Form.Item
                  name="rollnumber"
                  label="Roll Number"
                  rules={[{ required: true, message: "Please select your city" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select Roll Number"
                    // onChange={(value) => fetchCities(value)}
                  >
                    {rollNumbers.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: "Please select your country" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  // onChange={(value) => fetchStates(value)}
                >
                  {/* {countries.map((country) => (
                    <Option key={country.code} value={country.name}>
                      {country.name}
                    </Option>
                  ))} */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "Please select your state" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State"
                  // onChange={(value) => fetchCities(value)}
                >
                  {/* {states.map((state) => (
                    <Option key={state.name} value={state.name}>
                      {state.name}
                    </Option>
                  ))} */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please select your city" }]}
              >
                <Select showSearch placeholder="Select City">
                  {/* {cities.map((city) => (
                    <Option key={city.name} value={city.name}>
                      {city.name}
                    </Option>
                  ))} */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pinCode"
                label="Pin Code"
                rules={[{ required: true, message: "Please enter your pin code" }]}
              >
                <Input
                  placeholder="Pin Code"
                  addonAfter={
                    <Button type="link" onClick={handlePinCodeSearch}>
                      Search
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Button className="signUpButton" type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form>
        <div className="app-promotion">
          <p>Already have an account? Login now. </p>
          <Button type="link" onClick={() => navigate("/")}>
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
