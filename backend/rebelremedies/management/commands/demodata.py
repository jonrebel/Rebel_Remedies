from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rebelremedies.models import Ticket, TicketComment
import random


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        PASSWORD = "DemoPass123!"
        if not User.objects.filter(username="admin").exists():
            admin = User.objects.create_superuser(
                username="admin",
                email="admin@demo.com",
                password=PASSWORD,
            )
            
        if not User.objects.filter(username="tech").exists():
            tech = User.objects.create_user(
                username="tech",
                email="tech@demo.com",
                password=PASSWORD,
                is_staff=True,
            )

        if not User.objects.filter(username="user").exists():
            user = User.objects.create_user(
                username="user",
                email="user@demo.com",
                password=PASSWORD,
            )
        else:
            user = User.objects.get(username="user")

        if Ticket.objects.filter(title__startswith="[DEMO]").exists():
            return

        statuses = list(Ticket.Status.values)
        priorities = list(Ticket.Priority.values)

        tickets = []
        for i in range(15):
            tickets.append(
                Ticket.objects.create(
                    title=f"[DEMO] Issue #{i+1}",
                    description="Demo ticket for interview.",
                    status=random.choice(statuses),
                    priority=random.choice(priorities),
                    created_by=user,
                )
            )

        for ticket in random.sample(tickets, 5):
            TicketComment.objects.create(ticket=ticket, comment="User reported issue.")
            TicketComment.objects.create(ticket=ticket, comment="Tech working on it.")
