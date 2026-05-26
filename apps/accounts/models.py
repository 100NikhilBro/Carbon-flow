from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.companies.models import Company


class User(AbstractUser):

    ROLE_CHOICES = [

        ("admin", "Admin"),

        ("analyst", "Analyst"),

        ("viewer", "Viewer"),
    ]

    role = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default="viewer"
    )

    company = models.ForeignKey(

        Company,

        on_delete=models.CASCADE,

        related_name="users",

        null=True,

        blank=True,
    )

    def __str__(self):

        return self.username