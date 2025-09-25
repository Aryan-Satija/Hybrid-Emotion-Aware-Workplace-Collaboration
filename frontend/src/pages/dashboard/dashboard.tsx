import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Avatar,
  Typography,
  List,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header, Footer } = Layout;
const { Text } = Typography;

export function Dashboard() {
  // Hardcoded DM list
  const users = [
    { id: 1, name: "Neha", avatar: <UserOutlined /> },
    { id: 2, name: "Rahul", avatar: <UserOutlined /> },
    { id: 3, name: "Sneha", avatar: <UserOutlined /> },
    { id: 4, name: "Vikram", avatar: <UserOutlined /> },
  ];

  // Hardcoded messages
  const chatHistory: Record<number, { user: string; text: string; time: string }[]> = {
    1: [
      { user: "Neha", text: "Hey Aryan! How are you?", time: "9:15 AM" },
      { user: "Aryan", text: "I’m good, working on the project. You?", time: "9:17 AM" },
    ],
    2: [
      { user: "Rahul", text: "Bro, did you check the docs?", time: "10:00 AM" },
      { user: "Aryan", text: "Yes, going through them now.", time: "10:05 AM" },
    ],
    3: [
      { user: "Sneha", text: "Meeting at 3 PM?", time: "8:45 AM" },
      { user: "Aryan", text: "Works for me 👍", time: "8:50 AM" },
    ],
    4: [
      { user: "Vikram", text: "Game night today?", time: "11:10 AM" },
    ],
  };

  const [activeUser, setActiveUser] = useState(users[0]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    chatHistory[activeUser.id].push({
      user: "Aryan",
      text: inputValue,
      time: "Now",
    });
    setInputValue("");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: "#fff", borderRight: "1px solid #eee" }}>
        <div style={{ padding: "16px", display: "flex", alignItems: "center" }}>
          <Avatar size="large" icon={<UserOutlined />} />
          <Text strong style={{ marginLeft: 12 }}>Aryan</Text>
        </div>
        <Divider style={{ margin: "8px 0" }}>Direct Messages</Divider>
        <List
          dataSource={users}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                background: activeUser.id === item.id ? "#f5f5f5" : "transparent",
                borderRadius: 6,
              }}
              onClick={() => setActiveUser(item)}
            >
              <Space>
                <Avatar icon={item.avatar} />
                <Text>{item.name}</Text>
              </Space>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          style={{ marginTop: "12px" }}
        >
          New DM
        </Button>
      </Sider>

      {/* Main Chat Window */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            borderBottom: "1px solid #eee",
          }}
        >
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{activeUser.name}</Text>
          </Space>
        </Header>

        <Content style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
          <List
            dataSource={chatHistory[activeUser.id]}
            renderItem={(msg) => (
              <List.Item style={{ border: "none", padding: "4px 0" }}>
                <Space align="start">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <div>
                    <Text strong>{msg.user}</Text>{" "}
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {msg.time}
                    </Text>
                    <div style={{ marginTop: 2 }}>{msg.text}</div>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Content>

        <Footer style={{ padding: "8px 16px", background: "#fff" }}>
          <Input
            placeholder={`Message ${activeUser.name}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            suffix={
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSend}
              />
            }
          />
        </Footer>
      </Layout>
    </Layout>
  );
}
