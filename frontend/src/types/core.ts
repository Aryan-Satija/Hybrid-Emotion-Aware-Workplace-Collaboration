export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  role: string;
}

export interface Message {
    from_user: string;
    to_user: string;
    message: string;
    created_at: string;
}