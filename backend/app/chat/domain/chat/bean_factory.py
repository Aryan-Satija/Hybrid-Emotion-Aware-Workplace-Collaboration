from .beans import ChatBean
from ...models.chat import Chat


class ChatBeanFactory:
    
    @staticmethod
    def from_model(chat: Chat) -> ChatBean:
        return ChatBean(
            id=chat.id,
            from_user_id=str(chat.from_user.id),
            to_user_id=str(chat.to_user.id),
            text=chat.text,
            created_at=chat.created_at
        )