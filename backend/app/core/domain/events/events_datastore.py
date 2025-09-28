from ...models.events import Events
from .bean_factory import EventBeanFactory
from .beans import EventBean
from datetime import datetime, timedelta
from typing import List, Dict
from mongoengine.queryset.visitor import Q
from datetime import timezone
from dateutil.relativedelta import relativedelta

class EventDataStore:
    @staticmethod
    def create_event(data: dict) -> EventBean:
        event = Events(**data).save()
        return EventBeanFactory.to_bean(event)

    @staticmethod
    def get_event_by_id(event_id: str) -> EventBean:
        event = Events.objects.get(id=event_id)
        return EventBeanFactory.to_bean(event)

    @staticmethod
    def update_event(event_id: str, data: dict) -> EventBean:
        event = Events.objects.get(id=event_id)
        for field, value in data.items():
            setattr(event, field, value)
        event.save()
        return EventBeanFactory.to_bean(event)

    @staticmethod
    def delete_event(event_id: str) -> None:
        event = Events.objects.get(id=event_id)
        event.delete()

    @staticmethod
    def list_events() -> list[EventBean]:
        return [EventBeanFactory.to_bean(e) for e in Events.objects.all()]
    
    @classmethod
    def _ensure_utc_aware(cls, dt: datetime) -> datetime:
        if dt is None:
            return None
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)

    @classmethod
    def events_for_employee(cls, employee_id: str,
                            start: datetime,
                            end: datetime) -> List[Dict]:

        range_start = cls._ensure_utc_aware(start)
        range_end   = cls._ensure_utc_aware(end)

        candidates = Events.objects(
            Q(attendees=employee_id),
            start_time__lte=range_end
        )

        results = []
        for ev in candidates:
            for occ_start, occ_end in cls.expand_occurrences(ev, range_start, range_end):
                bean = EventBeanFactory.to_bean(ev)
                results.append({
                    **bean.__dict__,
                    "occurrence_start": occ_start,
                    "occurrence_end": occ_end,
                })
        return results

    @staticmethod
    def expand_occurrences(event, range_start, range_end):
        ev_start = event.start_time
        ev_end = event.end_time

        if ev_start.tzinfo is None:
            ev_start = ev_start.replace(tzinfo=timezone.utc)
        else:
            ev_start = ev_start.astimezone(timezone.utc)

        if ev_end.tzinfo is None:
            ev_end = ev_end.replace(tzinfo=timezone.utc)
        else:
            ev_end = ev_end.astimezone(timezone.utc)
        
        if not event.is_recurring or event.recurrence_rule == "none":
            if ev_end >= range_start and ev_start <= range_end:
                yield ev_start, ev_end
            return

        start = ev_start
        end = ev_end
        delta = None
        
        if event.recurrence_rule == "daily":
            delta = timedelta(days=1)
        elif event.recurrence_rule == "weekly":
            delta = timedelta(weeks=1)
        elif event.recurrence_rule == "monthly":
            delta = relativedelta(months=1)
        elif event.recurrence_rule == "yearly":
            delta = relativedelta(years=1)

        cur_start = start
        cur_end   = end

        if delta is None:
            return

        while cur_start <= range_end:
            if cur_end >= range_start:
                yield cur_start, cur_end
            cur_start = cur_start + delta
            cur_end   = cur_end + delta
