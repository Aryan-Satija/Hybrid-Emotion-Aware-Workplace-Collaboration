import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Layout, List, Typography } from "antd";
import type { Employee, Message } from "../../../types/core";

const { Content } = Layout;
const { Text } = Typography;

export const MessageFeed: React.FC<{
  recipient: Employee | null;
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
}> = ({ recipient, messages, setMessages }) => {
  const token = localStorage.getItem("token");
  const employee: Employee = JSON.parse(localStorage.getItem("employee") ?? "");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
};
