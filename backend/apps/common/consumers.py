from channels.generic.websocket import (
    AsyncWebsocketConsumer
)

import json


class ESGConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        user = self.scope["user"]

        # =========================
        # AUTH CHECK
        # =========================

        if not user.is_authenticated:

            await self.close()

            return

        # =========================
        # COMPANY-SPECIFIC GROUP
        # =========================

        company_id = str(
            user.company.id
        )

        self.group_name = (
            f"company_{company_id}"
        )

        # =========================
        # JOIN GROUP
        # =========================

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(
        self,
        close_code
    ):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_esg_update(
        self,
        event
    ):

        await self.send(
            text_data=json.dumps(
                event["data"]
            )
        )