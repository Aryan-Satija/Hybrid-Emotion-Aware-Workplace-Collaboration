from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from django.utils.dateparse import parse_datetime
from datetime import timezone, datetime
from ..domain.events.events_datastore import EventDataStore
from typing import Dict, Any

class Event(ViewSet):
    def _bean_to_dict(self, event):
        return {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "organizer": event.organizer,
            "attendees": event.attendees,
            "company": event.company,
            "start_time": event.start_time,
            "end_time": event.end_time,
            "is_recurring": event.is_recurring,
            "recurrence_rule": event.recurrence_rule,
            "location": event.location,
            "created_at": event.created_at,
            "updated_at": event.updated_at,
        }

    def retrieve(self, request, event_id=None):
        event = EventDataStore.get_event_by_id(event_id)
        return Response(self._bean_to_dict(event), status=HTTP_200_OK)

    def create(self, request):
        event = EventDataStore.create_event(request.data)
        return Response(self._bean_to_dict(event), status=HTTP_201_CREATED)

    def update(self, request, event_id=None):
        event = EventDataStore.update_event(event_id, request.data)
        return Response(self._bean_to_dict(event), status=HTTP_200_OK)

    def destroy(self, request, event_id=None):
        EventDataStore.delete_event(event_id)
        return Response(status=HTTP_204_NO_CONTENT)

    def list(self, request):
        events = EventDataStore.list_events()
        return Response([self._bean_to_dict(e) for e in events], status=HTTP_200_OK)

    def _format_dt(self, dt: Any) -> Any:
        if dt is None:
            return None
        if isinstance(dt, str):
            return dt
        if isinstance(dt, datetime):
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            else:
                dt = dt.astimezone(timezone.utc)
            return dt.isoformat()
        return dt

    def _dict_event_to_response(self, event_dict: Dict) -> Dict:
        e = event_dict.copy()
        for key in ("start_time", "end_time", "occurrence_start", "occurrence_end", "created_at", "updated_at"):
            if key in e:
                e[key] = self._format_dt(e[key])
        e["attendees"] = e.get("attendees") or []
        return e
    
    def employee_events(self, request, employee_id=None):
        def _ensure_utc_aware(dt):
            if dt is None:
                return None
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        
        start_str = request.query_params.get("start")
        end_str = request.query_params.get("end")

        if not start_str or not end_str:
            raise ParseError("Query params 'start' and 'end' are required.")

        start = parse_datetime(start_str)
        end = parse_datetime(end_str)

        if not start or not end:
            raise ParseError("Invalid datetime format. Use ISO8601, e.g. 2025-09-27T09:00:00Z.")

        start = _ensure_utc_aware(start)
        end = _ensure_utc_aware(end)

        events = EventDataStore.events_for_employee(employee_id, start, end)
        
        response_events = [
            self._bean_to_dict(e) if not isinstance(e, dict) else self._dict_event_to_response(e)
            for e in events
        ]
        
        return Response(response_events, status=HTTP_200_OK)