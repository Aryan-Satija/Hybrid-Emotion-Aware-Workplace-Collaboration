from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime


@dataclass
class EventBean:
    id: str
    title: str
    description: str
    organizer: str              
    attendees: List[str]      
    company: str
    start_time: datetime
    end_time: datetime
    is_recurring: bool
    recurrence_rule: str
    location: Optional[str]
    created_at: datetime
    updated_at: datetime
