import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
from .domain.chat.chat_datastore import ChatDatastore
from .constants import CONSOLING_MESSAGES
import text2emotion as te
from datetime import datetime, timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        to_user_id = data.get("to_user_id")
        from_user_id = data.get("from_user_id")
        force = data.get("force", False)
        
        emotion_score = te.get_emotion(message) 
        anger = emotion_score.get("Angry", 0) 

        if not force and anger > 0.7:
            await self.send(
                text_data=json.dumps({
                    "message": {
                        "from_user": "system",
                        "to_user": from_user_id,
                        "message": random.choice(CONSOLING_MESSAGES),
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    }
                })
            )
            return

        chat = ChatDatastore.create_chat(from_user_id, to_user_id, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": {
                    "from_user": chat.from_user_id,
                    "to_user": chat.to_user_id,
                    "message": chat.text,
                    "created_at": str(chat.created_at),
                },
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))
