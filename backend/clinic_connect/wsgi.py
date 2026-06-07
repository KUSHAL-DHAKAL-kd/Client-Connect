"""
WSGI config for clinic_connect project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys

# Add the root 'ai' folder to sys.path so we can import its modules
ai_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ai'))
if ai_path not in sys.path:
    sys.path.append(ai_path)

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic_connect.settings')

application = get_wsgi_application()
