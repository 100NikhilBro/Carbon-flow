from django.db import models
import uuid

from apps.companies.models import Company
from apps.uploads.models import UploadJob


class ESGRecord(models.Model):

    SCOPE_CHOICES = [
        ("scope_1", "Scope 1"),
        ("scope_2", "Scope 2"),
        ("scope_3", "Scope 3"),
    ]

    REVIEW_STATUS = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="esg_records",
        db_index=True
    )

    upload_job = models.ForeignKey(
        UploadJob,
        on_delete=models.CASCADE,
        related_name="esg_records"
    )

    scope = models.CharField(
        max_length=50,
        choices=SCOPE_CHOICES,
        db_index=True
    )

    category = models.CharField(
        max_length=255
    )

    activity_type = models.CharField(
        max_length=255
    )

    quantity = models.FloatField()

    unit = models.CharField(
        max_length=50
    )

    normalized_quantity = models.FloatField()

    normalized_unit = models.CharField(
        max_length=50
    )

    co2e_emissions = models.FloatField()

    source_reference = models.TextField()

    occurred_on = models.DateField()

    review_status = models.CharField(
        max_length=50,
        choices=REVIEW_STATUS,
        default="pending",
        db_index=True
    )

    is_flagged = models.BooleanField(
        default=False
    )

    flag_reason = models.TextField(
        null=True,
        blank=True
    )

    analyst_notes = models.TextField(
        null=True,
        blank=True
    )

    reviewed_by = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True
    )

    def __str__(self):

        return (
            f"{self.company.name} "
            f"- {self.scope}"
        )