# chat/views.py
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from ..domain.chat.chat_datastore import ChatDatastore

class Chat(ViewSet):

    def get_chats_between(self, request):
        from_user_id = request.query_params.get("from_user")
        to_user_id = request.query_params.get("to_user")

        if not from_user_id or not to_user_id:
            return Response({"error": "from_user and to_user are required"}, status=400)

        chats = ChatDatastore.get_chats_between_users(from_user_id, to_user_id)

        data = [
            {
                "id": str(chat.id),
                "from_user":chat.from_user_id,
                "to_user": chat.to_user_id,
                "message": chat.text,
                "created_at": str(chat.created_at),
            }
            for chat in chats
        ]
        return Response(data, status=HTTP_200_OK)
