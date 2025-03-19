import React from "react";
import "./index.css";
import { Form, Input, Button, notification, message} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ setIsLoggedIn, setUserId }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const onFinish = (values) => {
    axios
    .post(`/ims/userLogin?loginId=${values.userName}&password=${values.password}`)
    .then((res) => {
      console.log('checking res', res);
      notification.success({
        message: "Login successfully!",
      });
      setUserId(values.userName);
      setIsLoggedIn(true);
      if (values.userName.includes('Principal')) {
        navigate("/adminLogin");
      } else {
        navigate("/home");
      }
    })
    .catch((err) => {
      message.error("Failed to load states.");
    });
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Empowering your child's future with ease and confidence!</h1>
        <p>
          This platform is designed to streamline incident reporting and
          resolution, ensuring a smoother and more efficient workflow for your
          team.
        </p>
      </div>
      <div className="right-section">
        <h2>Login</h2>
        <Form
          className="login-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="userName"
            label="User Id"
            rules={[{ required: true, message: "Please enter your user id" }]}
          >
            <Input placeholder="User Id" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button className="signUpButton" type="primary" htmlType="submit">
            Log in
          </Button>
        </Form>
        <div className="app-promotion">
          <p>If you don't have an account click below to sign up</p>
          <button className="get-app-button" onClick={handleSignUp}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
