from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.accounts.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (

        (
            "Company Info",
            {
                "fields": (
                    "role",
                    "company",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (

        (
            "Company Info",
            {
                "fields": (
                    "role",
                    "company",
                )
            },
        ),
    )