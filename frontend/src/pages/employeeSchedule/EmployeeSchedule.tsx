import React, { useState, useEffect } from "react";
import {
  Calendar,
  Modal,
  Form,
  Input,
  Button,
  TimePicker,
  Layout,
  Select,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { EmployeeList } from "../../components/employeeList/EmployeeList";

const { Content } = Layout;
const { RangePicker } = TimePicker;

type Event = {
  id: number;
  title: string;
  description: string;
  location?: string;
  start_time: Date;
  end_time: Date;
  recurrence_rule: string;
  employeeId: string;
};

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  role: string;
}

export const EmployeeSchedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const employee = JSON.parse(localStorage.getItem("employee"))
  const onSelectDate = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedEmployee) return;

    form.validateFields().then((values) => {
      const [start, end] = values.time;

      const start_time = selectedDate
        .hour(start.hour())
        .minute(start.minute())
        .toISOString();

      const end_time = selectedDate
        .hour(end.hour())
        .minute(end.minute())
        .toISOString();

      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        start_time,
        end_time,
        recurrence_rule: values.recurrence_rule,
        is_recurring: values.recurrence_rule === "None" ? false : true,
        organizer: selectedEmployee.id,
        attendees: [selectedEmployee.id],
        company: selectedEmployee.company_id,
      };

      fetch("http://127.0.0.1:8000/api/core/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          const newEvent: Event = {
            id: data.id,
            ...payload,
            start_time: new Date(payload.start_time),
            end_time: new Date(payload.end_time),
            employeeId: selectedEmployee.id,
          };
          setEvents([...events, newEvent]);
          form.resetFields();
          setIsModalOpen(false);
        })
        .catch((err) => console.error(err));
    });
  };

  useEffect(() => {
    if (!selectedEmployee) return;

    const start = selectedDate.startOf("month").toISOString();
    const end = selectedDate.endOf("month").toISOString();

    fetch(
      `http://127.0.0.1:8000/api/core/events/employee/${selectedEmployee.id}/?start=${start}&end=${end}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const eventsData = data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          location: e.location,
          start_time: new Date(e.occurrence_start || e.start_time),
          end_time: new Date(e.occurrence_end || e.end_time),
          recurrence_rule: e.recurrence_rule,
          employeeId: selectedEmployee.id,
        }));
        eventsData.sort((a: any, b: any) => a.start_time - b.start_time)
        setEvents(eventsData);
      })
      .catch((err) => console.error(err));
  }, [selectedEmployee, selectedDate]);

  const dateCellRender = (date: Dayjs) => {
    const dayEvents = events.filter(
      (e) =>
        e.employeeId === selectedEmployee?.id &&
        dayjs(e.start_time).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );
    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {dayEvents.map((event) => (
          <li key={event.id}>
            <span style={{ fontWeight: "bold" }}>
              {dayjs(event.start_time).format("HH:mm")} -{" "}
              {dayjs(event.end_time).format("HH:mm")}
            </span>{" "}
            {event.title}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout style={{ height: "97vh" }}>
      <EmployeeList
        selectedUser={selectedEmployee}
        setSelectedUser={setSelectedEmployee}
      />

      <Content style={{ padding: 24, overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>
            Schedule – {selectedEmployee?.first_name ?? "Select an Employee"}
          </h2>
          {
            employee.role.toLowerCase() === "admin" && 
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedEmployee}
            >
              + Create Event
            </Button>
          }
        </div>

        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onSelectDate}
          style={{ padding: "8px" }}
        />

        <Modal
          title="Create New Event"
          open={isModalOpen}
          onOk={handleAddEvent}
          onCancel={() => setIsModalOpen(false)}
          okText="Save"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Event Title"
              rules={[{ required: true, message: "Please enter event title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter event location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Event Time"
              rules={[
                { required: true, message: "Please select start and end time" },
              ]}
            >
              <RangePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
              name="recurrence_rule"
              label="Recurrence"
              initialValue="none"
            >
              <Select>
                <Select.Option value="none">None</Select.Option>
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
