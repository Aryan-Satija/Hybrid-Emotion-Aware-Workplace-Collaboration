import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Upload,
  message,
  theme,
} from 'antd'
import {
  UploadOutlined,
  BankOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Content } = Layout

export function Signup() {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const { token } = theme.useToken()
  const navigate = useNavigate()

  interface SignupValues {
    companyName: string
    domain?: string
    industry?: string
    location?: string
    state?: string
    logo?: any
  }

  const onFinish = async (values: SignupValues) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", values.companyName)
      if (values.domain) formData.append("domain", values.domain)
      if (values.industry) formData.append("industry", values.industry)
      if (values.location) formData.append("location", values.location)
      if (values.state) formData.append("state", values.state)
      if (values.logo && values.logo[0]) {
        formData.append("logo", values.logo[0].originFileObj) 
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/core/companies/",
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Failed to register company")
      }

      const data = await response.json()
      messageApi.success(`Welcome, ${data.companyName || values.companyName}! 🎉`)
      navigate(`/register/companies/${data.id}/admin/`)
    } catch (error) {
      console.error(error)
      messageApi.error("Something went wrong!")
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
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
            Create Your Account
          </Title>
          <Text
            type="secondary"
            style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}
          >
            Fill in your company details to get started
          </Text>

          <Form
            name="signup"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div className='flex justify-between  gap-8'>
                <div className='w-[400px]'>
                    <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please enter your company name' }]}
                    >
                    <Input
                        prefix={<BankOutlined />}
                        placeholder="Acme Inc."
                        size="large"
                    />
                    </Form.Item>

                    <Form.Item name="domain" label="Domain">
                    <Input
                        prefix={<GlobalOutlined />}
                        placeholder="acme.com"
                        size="large"
                    />
                    </Form.Item>

                    <Form.Item name="industry" label="Industry">
                    <Input
                        prefix={<AppstoreOutlined />}
                        placeholder="Technology"
                        size="large"
                    />
                    </Form.Item>

                    <Form.Item name="location" label="Location">
                    <Input
                        prefix={<EnvironmentOutlined />}
                        placeholder="City, Country"
                        size="large"
                    />
                    </Form.Item>

                    <Form.Item name="state" label="State">
                    <Input
                        prefix={<FlagOutlined />}
                        placeholder="State/Province"
                        size="large"
                    />
                    </Form.Item>
                </div>
                <div className='flex flex-col items-center justify-center h-full'>
                    <Form.Item
                        name="logo"
                        label="Company Logo"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                    <Upload.Dragger
                        name="logo"
                        accept="image/*"
                        beforeUpload={() => false} 
                        maxCount={1}  
                    >
                        <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                        Click or drag image to upload
                        </p>
                        <p className="ant-upload-hint">
                        PNG, JPG, or SVG up to 2 MB
                        </p>
                    </Upload.Dragger>
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
                icon={<UserAddOutlined />}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <Text
            type="secondary"
            style={{ display: 'block', textAlign: 'center', marginTop: 24 }}
          >
            Already have an account? <a href="/login">Log in</a>
          </Text>
        </div>
      </Content>
    </Layout>
  )
}
