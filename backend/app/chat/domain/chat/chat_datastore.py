from typing import List, Optional
from bson import ObjectId
from ...models.chat import Chat
from core.models.employee import Employee
from .bean_factory import ChatBeanFactory
from .beans import ChatBean
from mongoengine.queryset.visitor import Q

class ChatDatastore:

    @staticmethod
    def create_chat(from_user_id: str, to_user_id: str, text: str) -> ChatBean:
        from_user = Employee.objects.get(id=from_user_id)
        to_user = Employee.objects.get(id=to_user_id)
        chat = Chat(from_user=from_user, to_user=to_user, text=text)
        chat.save()
        return ChatBeanFactory.from_model(chat)

    @staticmethod
    def get_chat_by_id(chat_id: str) -> Optional[ChatBean]:
        try:
            return ChatBeanFactory.from_model(Chat.objects(id=ObjectId(chat_id)).first())
        except Exception:
            return None

    @staticmethod
    def get_chats_between_users(from_user_id: str, to_user_id: str, limit: int = 50) -> List[ChatBean]:
        user1 = Employee.objects.get(id=from_user_id)
        user2 = Employee.objects.get(id=to_user_id)

        chats = (
            Chat.objects(
                Q(from_user=user1, to_user=user2) | Q(from_user=user2, to_user=user1)
            )
            .order_by("-created_at")
            .limit(limit)
        )

        return [ChatBeanFactory.from_model(chat) for chat in chats]
