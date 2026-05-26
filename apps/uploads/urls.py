from django.urls import path

from .views import UploadFileAPIView


urlpatterns = [
    path(
        "upload/",
        UploadFileAPIView.as_view(),
        name="upload-file",
    ),
]