from django.db import models
import uuid

from apps.companies.models import Company


class UploadJob(models.Model):

    SOURCE_TYPES = [
        ("sap", "SAP"),
        ("utility", "Utility"),
        ("travel", "Travel"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="upload_jobs"
    )

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPES
    )

    original_file_name = models.CharField(
        max_length=255
    )

    # CLOUDINARY FILE URL
    file = models.URLField()

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="pending"
    )

    uploaded_by = models.CharField(
        max_length=255
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    processed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    error_message = models.TextField(
        null=True,
        blank=True
    )

    def __str__(self):

        return (
            f"{self.company.name} - "
            f"{self.source_type}"
        )