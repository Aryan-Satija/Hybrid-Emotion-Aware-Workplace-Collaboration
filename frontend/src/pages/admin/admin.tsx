import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  message,
  theme,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CrownOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Content } = Layout

export function CreateAdmin() {
  const [loading, setLoading] = useState(false)
  const [msgApi, contextHolder] = message.useMessage()
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { companyId } = useParams<{ companyId: string }>()

  interface AdminValues {
    first_name: string
    last_name?: string
    email: string
    password: string
    role?: string
  }

  const onFinish = async (values: AdminValues) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        role: values.role || 'admin',
      }

      const res = await fetch(`http://127.0.0.1:8000/api/core/companies/${companyId}/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Failed to create admin')
      }

      const data = await res.json()
      msgApi.success(`Admin ${data.first_name} created successfully! 🎉`)
      navigate('/login')
    } catch (e: any) {
      console.error(e)
      msgApi.error(e.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', padding: '10px' }}>
      {contextHolder}
      <Content
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: token.colorBgLayout,
        }}
      >
        <div
          style={{
            width: 800,
            padding: '48px 40px',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            backgroundColor: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
            Create Admin Account
          </Title>
          <Text
            type="secondary"
            style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}
          >
            Set up the first administrator for your company
          </Text>

          <Form
            name="create-admin"
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
          >
            <div className="flex justify-between gap-8">
              <div className="w-[400px]">
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="John"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="last_name" label="Last Name">
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Doe"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Invalid email address' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="john@example.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter a password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="••••••"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="role" label="Role" initialValue="Admin">
                  <Input
                    prefix={<CrownOutlined />}
                    size="large"
                    disabled
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Create Admin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  )
}
