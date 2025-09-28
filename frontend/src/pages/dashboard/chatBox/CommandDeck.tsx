import React from "react";
import {
  Layout,
  Avatar,
  Space,
  Typography
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Employee } from "../../../types/core"

const { Text } = Typography;
const { Header } = Layout;


export const CommandDeck: React.FC<{recipient: Employee | null}> = ({ recipient }) => {
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        height: 64,
      }}
    >
      <Space>
        <Avatar icon={<UserOutlined />} />
        <Text strong>{recipient?.first_name}</Text>
      </Space>
    </Header>
  );
};
