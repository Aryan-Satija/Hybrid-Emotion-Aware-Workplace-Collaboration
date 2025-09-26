from django.urls import path
from .viewsets.chat import Chat

chat_view = Chat.as_view({"get": "get_chats_between"})

urlpatterns = [
    path("between/", chat_view, name="chat-between"),
]