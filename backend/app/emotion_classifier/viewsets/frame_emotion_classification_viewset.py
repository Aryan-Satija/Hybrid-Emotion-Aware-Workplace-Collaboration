import os
import tempfile
from deepface import DeepFace
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

class FrameEmotionClassificationView(ViewSet):
    
    def post(self, request, *args, **kwargs,):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image provided"}, status=HTTP_400_BAD_REQUEST)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            tmp.write(image_file.read())
            tmp_path = tmp.name
        
        try:
            result = DeepFace.analyze(img_path=tmp_path, actions=['emotion'])
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        
        return Response(result, status=HTTP_200_OK)