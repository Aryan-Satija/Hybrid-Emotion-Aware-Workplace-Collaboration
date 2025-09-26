from datetime import datetime, timezone
from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    DateTimeField,
    DictField
)


class Chat(Document):
    
    from_user = ReferenceField("Employee", required=True)
    to_user = ReferenceField("Employee", required=True)
    text = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    emotions = DictField(default=lambda: {
        "Happy": 0.0,
        "Angry": 0.0,
        "Surprise": 0.0,
        "Sad": 0.0,
        "Fear": 0.0,
        "Neutral": 0.0
    })