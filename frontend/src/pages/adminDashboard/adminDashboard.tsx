import { useState, useEffect } from "react";
import {
  Card,
  Layout,
  List,
  Tag,
  Button,
  message,
  Form,
  Input,
  Select,
  Space,
  Tooltip,
  Divider,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  UploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Option } = Select;

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export const AdminDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const employee = JSON.parse(localStorage.getItem("employee") ?? "");
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  const roleColors: Record<string, string> = {
    admin: "red",
    manager: "blue",
    employee: "green",
  };

  const generatePassword = (length = 12) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const fetchEmployees = async () => {
    if (!employee || !token) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/core/companies/${employee.company_id}/employees/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();
      setEmployees(data);
    } catch (err: any) {
      console.error(err);
      message.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFinish = async (values: any) => {
    if (!employee.company_id || !token) return;
    setFormLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/core/companies/${employee.company_id}/employees/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      message.success("Employee created successfully!");
      fetchEmployees();
      form.resetFields();
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout style={{ height: "97vh", backgroundColor: "#f5f6fa" }}>
      <Sider
        width={340}
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid #eee",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          <h2
            style={{
              fontWeight: "bold",
              marginBottom: "16px",
              color: "black",
            }}
          >
            Employees
          </h2>

          <List
            itemLayout="horizontal"
            dataSource={employees}
            renderItem={(emp) => (
              <List.Item
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  border:
                    selectedEmployee?.id === emp.id
                      ? "1px solid #1677ff"
                      : "1px solid #f0f0f0",
                  backgroundColor:
                    selectedEmployee?.id === emp.id ? "#e6f4ff" : "#fff",
                }}
                onClick={() => setSelectedEmployee(emp)}
              >
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "black" }}>
                        {emp.first_name} {emp.last_name}
                      </span>
                      <Tag color={roleColors[emp.role] || "default"}>
                        {emp.role}
                      </Tag>
                    </div>
                  }
                  description={
                    <div style={{ color: "black" }}>
                      <div style={{ fontSize: "12px" }}>{emp.email}</div>
                      {emp.is_active !== undefined && (
                        <Tag
                          color={emp.is_active ? "green" : "volcano"}
                          style={{ marginTop: "4px" }}
                        >
                          {emp.is_active ? "Active" : "Inactive"}
                        </Tag>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <Space>
                          <Tooltip title="Edit">
                            <Button type="text" icon={<EditOutlined />} />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Tooltip>
                          <Tooltip title="Chat">
                            <Button type="text" icon={<MessageOutlined />} />
                          </Tooltip>
                        </Space>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>

      <Layout style={{ backgroundColor: "#f5f6fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card
            title="Create Employee"
            bordered={false}
            style={{
              maxWidth: 600,
              margin: "0 auto",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Form layout="vertical" onFinish={handleFinish} form={form}>
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="John" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Doe" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="john.doe@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  placeholder="********"
                  addonAfter={
                    <Button
                      size="small"
                      onClick={() => {
                        const newPass = generatePassword();
                        form.setFieldsValue({ password: newPass });
                      }}
                    >
                      Generate
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Select role" }]}
              >
                <Select placeholder="Select role">
                  <Option value="employee">Employee</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={formLoading}
                block
              >
                Create Employee
              </Button>
            </Form>

            <Divider plain>OR</Divider>

            <Upload
              name="file"
              accept=".xlsx,.xls"
              showUploadList={false}
              beforeUpload={(file) => {
                message.success(`${file.name} uploaded successfully (mock)`);
                return false;
              }}
              style={{ width: "100%" }}
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "#fff",
                  width: "100%",
                }}
              >
                Import Excel Sheet
              </Button>
            </Upload>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};
