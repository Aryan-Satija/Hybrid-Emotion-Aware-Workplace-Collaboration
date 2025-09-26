from datetime import datetime, timezone
from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    DateTimeField
)


class Chat(Document):
    
    from_user = ReferenceField("Employee", required=True)
    to_user = ReferenceField("Employee", required=True)
    text = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    