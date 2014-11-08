from django.conf import settings
import socket

def common(request):
    return {
        'STATIC_URL': settings.STATIC_URL,
        'request': request,
    }

