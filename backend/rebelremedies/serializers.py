from rest_framework import serializers
from .models import Ticket
from .models import TicketComment

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        read_only_fields = ('id','created_at', 'updated_at')
        fields = ('id', 'title', 'description', 'status', 'priority', 'created_at', 'updated_at')

class TicketCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketComment
        read_only_fields = ("id", "created_at", "ticket")
        fields = ("id", "ticket", "body", "created_at")
