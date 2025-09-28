import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Avatar,
  Typography,
  List,
  Divider,
  Tag,
  Skeleton,
} from "antd";
import { PlusOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { Text, Title } = Typography;

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  logo_url: string;
  location: string;
  state: string;
  created_at: string;
  updated_at: string;
}

interface EmployeeListProps {
  selectedUser: Employee | null;
  setSelectedUser: Dispatch<SetStateAction<Employee | null>>;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  selectedUser,
  setSelectedUser,
}) => {
  const employee: Employee = JSON.parse(localStorage.getItem("employee") ?? "");
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<Employee[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const roleColors: Record<string, string> = {
    admin: "red",
    manager: "blue",
    employee: "green",
  };

  const navigate = useNavigate();

  const fetchCompanyAndEmployees = async () => {
    if (!employee || !token) return;

    try {
      const companyRes = await fetch(
        `http://127.0.0.1:8000/api/core/companies/${employee.company_id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!companyRes.ok) throw new Error("Failed to fetch company");
      const companyData = await companyRes.json();
      setCompany(companyData);

      const employeeRes = await fetch(
        `http://127.0.0.1:8000/api/core/companies/${employee.company_id}/employees/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!employeeRes.ok) throw new Error("Failed to fetch employees");
      const employeeData = await employeeRes.json();
      setUsers(employeeData);
      setSelectedUser(employeeData[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyAndEmployees();
  }, []);

  return (
    <Sider
      width={350}
      style={{
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "8px", textAlign: "center" }}>
        {loading ? (
          <Skeleton.Avatar active size="large" shape="circle" />
        ) : (
          <Avatar
            size={64}
            src={company?.logo_url}
            icon={<UserOutlined />}
            style={{ marginBottom: 8 }}
          />
        )}
        <Title level={4} style={{ margin: 0 }}>
          {company?.name || "Workspace"}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {company?.industry} • {company?.location}, {company?.state}
        </Text>
      </div>

      <Divider style={{ margin: "12px 0" }}>Your Profile</Divider>

      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Avatar size="large" icon={<UserOutlined />} />
        <div
          style={{
            marginLeft: 12,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text strong>
            {employee.first_name} {employee.last_name}
          </Text>
          <Tag color={roleColors[employee.role] || "default"}>
            {employee.role}
          </Tag>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }}>Direct Messages</Divider>

      <div style={{ flex: 1, overflowY: "auto", height: "300px" }}>
        <List
          dataSource={users}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: "12px 12px",
                cursor: "pointer",
                background:
                  selectedUser?.id === item.id ? "#f5f5f5" : "transparent",
                borderRadius: 6,
              }}
              onClick={() => setSelectedUser(item)}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Avatar icon={<UserOutlined />} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    {item.first_name} {item.last_name}
                  </span>
                  <Tag color={roleColors[item.role] || "default"}>
                    {item.role}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid #eee" }}>
        {employee.role.toLowerCase() === "admin" && (
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            style={{ marginBottom: "8px" }}
            onClick={() => {
              navigate(`/admin/companies/${employee.company_id}/create`);
            }}
          >
            New Employee
          </Button>
        )}
        <Button
            type="dashed"
            block
            icon={<CalendarOutlined />}
            style={{ marginBottom: "8px" }}
            onClick={() => {
              navigate(`/admin/companies/${employee.company_id}/schedule`);
            }}
          >
            Calendar
        </Button>
        <Button
          danger
          block
          onClick={() => {
            localStorage.removeItem("employee");
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};
