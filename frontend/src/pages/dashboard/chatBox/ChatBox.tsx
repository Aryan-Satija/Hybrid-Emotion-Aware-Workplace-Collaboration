import { useState, useEffect, useRef } from "react";
import {
  Layout,
  notification,
} from "antd";
import type { Employee } from "../../../types/core";
import { CommandDeck } from "./CommandDeck";
import { MessageFeed } from "./MessageFeed";
import { InputDoc } from "./InputDoc";

interface ChatBoxProps {
  recipient: Employee | null;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ recipient }) => {
  const employee: Employee = JSON.parse(localStorage.getItem("employee") ?? "");

  const [messages, setMessages] = useState<
    {
      from_user: string;
      to_user: string;
      message: string;
      created_at: string;
    }[]
  >([]);

  const [api, contextHolder] = notification.useNotification();
  const ws = useRef<WebSocket | null>(null);
  function getGroupName(userId1: string, userId2: string) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }

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
      const msg = data.message;
      if (msg.from_user === "system") {
        api.info({
          message: "System Message",
          description: msg.message,
          placement: "topRight",
          duration: 4,
        });
        return;
      }
      setMessages((prev) => [...prev, data.message]);
    };

    return () => {
      socket.close();
    };
  }, [recipient?.id, employee.id]);

  return (
    <Layout style={{ height: "98vh", background: "#f5f6fa" }}>
      {contextHolder}
      <CommandDeck recipient={recipient}/>
      <MessageFeed recipient={recipient} messages={messages} setMessages={setMessages}/> 
      <InputDoc recipient={recipient} ws={ws}/>
    </Layout>
  );
};
