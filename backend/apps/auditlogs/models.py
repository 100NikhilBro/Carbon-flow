from django.db import models

import uuid


class AuditLog(models.Model):

    ACTION_CHOICES = [
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("uploaded", "Uploaded"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    username = models.CharField(
        max_length=255
    )

    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES
    )

    entity_type = models.CharField(
        max_length=100
    )

    entity_id = models.CharField(
        max_length=255
    )

    changes = models.JSONField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.username} - "
            f"{self.action}"
        )