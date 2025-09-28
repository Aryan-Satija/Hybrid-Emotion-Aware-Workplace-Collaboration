from datetime import datetime, timezone
from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    ListField,
    DateTimeField,
    BooleanField,
    CASCADE,
    NULLIFY,
)


class Events(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    organizer = ReferenceField("Employee", reverse_delete_rule=CASCADE, required=True)
    attendees = ListField(ReferenceField("Employee", reverse_delete_rule=NULLIFY))
    company = ReferenceField("Company", reverse_delete_rule=CASCADE, required=True)
    start_time = DateTimeField(required=True)
    end_time = DateTimeField(required=True)
    is_recurring = BooleanField(default=False)
    recurrence_rule = StringField(
        choices=["none", "daily", "weekly", "monthly", "yearly"], default="none"
    )
    location = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {"collection": "Event"}

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)
        return super(Events, self).save(*args, **kwargs)
