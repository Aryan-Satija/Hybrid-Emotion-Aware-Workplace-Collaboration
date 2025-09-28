import { useState } from "react";
import { Layout, Input, Button, Tooltip } from "antd";
import { ThunderboltOutlined, SendOutlined } from "@ant-design/icons";
import type { Employee } from "../../../types/core";

const { Footer } = Layout;

export const InputDoc: React.FC<{ ws: React.RefObject<WebSocket | null>, recipient: Employee | null }> = ({
  ws,
  recipient,
}) => {

  const employee: Employee = JSON.parse(localStorage.getItem("employee") ?? "");
  const [inputValue, setInputValue] = useState("");
  const [force, setForce] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() || !ws || !ws.current) return;

    ws.current.send(
      JSON.stringify({
        from_user_id: employee?.id,
        to_user_id: recipient?.id,
        message: inputValue,
        force: force,
      })
    );

    setInputValue("");
  };

  return (
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title="Force Send">
              <ThunderboltOutlined
                style={{
                  color: force ? "#faad14" : "#999",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                onClick={() => setForce((prev) => !prev)}
              />
            </Tooltip>
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handleSend}
            />
          </div>
        }
      />
    </Footer>
  );
};
