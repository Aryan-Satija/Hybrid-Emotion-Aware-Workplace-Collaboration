from django.urls import path
from .viewsets.text_emotion_classification_viewset import (
    TextEmotionClassificationView,
    BatchTextEmotionClassificationView,
)
from .viewsets.frame_emotion_classification_viewset import FrameEmotionClassificationView

urlpatterns = [
    path("text/", TextEmotionClassificationView.as_view()),
    path(
        "text/batch/",
        BatchTextEmotionClassificationView.as_view(),
    ),
    path("frame/", FrameEmotionClassificationView.as_view({"post": "post"}))
]
