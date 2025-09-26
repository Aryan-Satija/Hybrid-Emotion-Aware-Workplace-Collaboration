import { useState } from "react";
import { Layout } from "antd";
import { EmployeeList } from "./employeeList/EmployeeList";
import { ChatBox } from "./chatBox/ChatBox";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  role: string;
}

export function Dashboard() {
  const [activeUser, setActiveUser] = useState<Employee | null>(null);
  return (
    <Layout style={{ height: "97vh" }}>
      <EmployeeList selectedUser={activeUser} setSelectedUser={setActiveUser} />
      <ChatBox recipient={activeUser}/>
    </Layout>
  );
}
