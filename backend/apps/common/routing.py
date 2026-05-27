from django.urls import re_path

from apps.common.consumers import ESGConsumer


websocket_urlpatterns = [
    re_path(r"ws/esg/$", ESGConsumer.as_asgi()),
]