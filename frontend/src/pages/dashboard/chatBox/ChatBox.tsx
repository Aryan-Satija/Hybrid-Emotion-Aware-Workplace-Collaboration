import { useState, useEffect, useRef } from "react";
import {
  Layout,
  Input,
  Button,
  Avatar,
  List,
  Typography,
  Space,
} from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";

const { Content, Header, Footer } = Layout;
const { Text } = Typography;

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  role: string;
}

interface ChatBoxProps {
  recipient: Employee | null;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ recipient }) => {
  const employee: Employee = JSON.parse(
    localStorage.getItem("employee") ?? ""
  );
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState<
    {
      from_user: string;
      to_user: string;
      message: string;
      created_at: string;
    }[]
  >([]);

  const [inputValue, setInputValue] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function getGroupName(userId1: string, userId2: string) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }

  const fetchChats = async () => {
    if (!employee || !recipient || !token) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/chats/between/?from_user=${employee.id}&to_user=${recipient.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch chats");

      const data = await res.json();

      const mappedMessages = data
        .sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        .map((chat: any) => ({
          from_user: chat.from_user,
          to_user: chat.to_user,
          message: chat.message,
          created_at: new Date(chat.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      setMessages(mappedMessages);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!recipient || !employee) return;
    fetchChats();
  }, [recipient?.id, employee.id]);

  useEffect(() => {
    if (!recipient) return;

    if (ws.current) {
      ws.current.close();
    }

    const group_name = getGroupName(employee.id, recipient.id);
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${group_name}/`);
    ws.current = socket;

    socket.onopen = () => {
      setMessages([]);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };

    return () => {
      socket.close();
    };
  }, [recipient?.id, employee.id]);

  useEffect(() => {
    // auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !ws.current) return;

    ws.current.send(
      JSON.stringify({
        from_user_id: employee?.id,
        to_user_id: recipient?.id,
        message: inputValue,
      })
    );

    setInputValue("");
  };

  return (
    <Layout style={{ height: "98vh", background: "#f5f6fa" }}>
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

      <Content
        style={{
          padding: "16px",
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List
          dataSource={messages}
          renderItem={(msg, i) => {
            const isMine = msg.from_user === employee.id;
            return (
              <List.Item
                key={i}
                style={{
                  border: "none",
                  padding: "4px 0",
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: 16,
                    background: isMine ? "#1677ff" : "#e4e6eb",
                    color: isMine ? "#fff" : "#000",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "14px" }}>{msg.message}</div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "10px",
                      display: "block",
                      marginTop: 2,
                      color: isMine ? "rgba(255,255,255,0.8)" : "#555",
                      textAlign: "right",
                    }}
                  >
                    {msg.created_at}
                  </Text>
                </div>
              </List.Item>
            );
          }}
        />
        <div ref={messagesEndRef} />
      </Content>

      <Footer
        style={{
          padding: "8px 16px",
          background: "#fff",
          borderTop: "1px solid #eee",
        }}
      >
        <Input
          placeholder={`Message ${recipient?.first_name}`}
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
  );
};
