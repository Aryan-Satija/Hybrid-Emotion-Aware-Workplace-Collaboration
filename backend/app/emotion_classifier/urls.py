from django.urls import path
from .viewsets.text_emotion_classification_viewset import (
    TextEmotionClassificationView,
    BatchTextEmotionClassificationView,
)
from .viewsets.ambience_emotion_classification_viewset import (
    AmbienceEmotionClassificationViewset,
)

urlpatterns = [
    path("text/", TextEmotionClassificationView.as_view()),
    path(
        "text/batch/",
        BatchTextEmotionClassificationView.as_view(),
    ),
    path(
        "ambience/process_image/",
        AmbienceEmotionClassificationViewset.as_view({"post": "process_image"}),
    ),
]
