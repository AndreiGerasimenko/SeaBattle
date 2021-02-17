import React, { useEffect } from "react";
import { Button, Typography, Row, Col, Input, Form, message } from "antd";
import { useHttp } from "../../hooks/http.hook";
import { useAuth } from "../../hooks/auth.hook";

import "./authPage.css";

export const AuthPage = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const { request, error, clearError, loading } = useHttp();
  const key = "success-error-message";

  useEffect(() => {
    if(error) {
      message.error({
        content: error,
        key
      });
      clearError();
    }
    if(loading) {
      message.loading({
        content: "Processing...",
        key,
        duration: 0
      });
    }
  }, [error, loading, clearError]);

  const onRegisterHandler = async () => {
    try {
      const values = await form.validateFields();
      const data = await request("/api/auth/register", "POST", JSON.stringify(values), { "Content-Type": "application/json"});
      message.success({
        content: data.message,
        key,
      });
      form.resetFields();
    } catch(error){
      console.log(error, "Error Info")
    }
  }

  const onLoginHandler = async () => {
    try {
      const values = await form.validateFields();
      const data = await request("/api/auth/login", "POST", JSON.stringify(values), { "Content-Type": "application/json"});
      form.resetFields();
      message.destroy(key);
      login(data.token, data.refreshToken, data.userId);
    } catch(error){
      console.log(error, "Error Info")
    }
  }

  return (
    <div className="auth-main-container">
      <Typography.Title level={2}>Welcome to Sea Battle</Typography.Title>
      <Form form={form} name="register-form" className="register-form">
        <Row gutter={[16, 8]} justify={"center"}>
          <Col
          xs={{ span: 22 }}
          sm={{ span: 11 }}
          md={{ span: 11 }}
          lg={{ span: 11 }}
          xl={{ span: 11 }}
          xxl={{ span: 11 }}
          >
            <Form.Item
              name="nickname"
              rules={[{ required: true, message: "The nickname is required" }]}
            >
              <Input placeholder="Nickname" size="large" />
            </Form.Item>
          </Col>
          <Col
          xs={{ span: 22 }}
          sm={{ span: 11 }}
          md={{ span: 11 }}
          lg={{ span: 11 }}
          xl={{ span: 11 }}
          xxl={{ span: 11 }}
          >
            <Form.Item
              name="password"
              rules={[
                { min: 6, message: "The password is too short" },
                { required: true, message: "The password is required" },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <div className="sendButton-container">
          <Button
            className="auth-form-button register-button"
            size="large"
            onClick={onRegisterHandler}
            disabled={loading}
          >
            Register
          </Button>
          <Button
            size="large"
            className="auth-form-button"
            onClick={onLoginHandler}
            disabled={loading}
          >
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};
