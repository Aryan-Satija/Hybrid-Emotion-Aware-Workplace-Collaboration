from .beans import EventBean
from ...models.events import Events


class EventBeanFactory:
    @staticmethod
    def to_bean(event: Events) -> EventBean:
        return EventBean(
            id=str(event.id),
            title=event.title,
            description=event.description,
            organizer=str(event.organizer.id) if event.organizer else None,
            attendees=[str(e.id) for e in event.attendees] if event.attendees else [],
            company=str(event.company.id) if event.company else None,
            start_time=event.start_time,
            end_time=event.end_time,
            is_recurring=event.is_recurring,
            recurrence_rule=event.recurrence_rule,
            location=event.location,
            created_at=event.created_at,
            updated_at=event.updated_at,
        )
