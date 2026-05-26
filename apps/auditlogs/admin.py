from django.contrib import admin

from apps.auditlogs.models import AuditLog


admin.site.register(AuditLog)