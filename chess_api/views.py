from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Game, Movement
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.views import APIView
from .tasks import process_movement_async


class GameListView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        serializer.save()
        movement_instance = serializer.instance
        if movement_instance.player_color == False: # the user is black, we're white
            print("ENTERING")
            process_movement_async.delay(game_id=movement_instance.id)
        return Response(serializer.data)


class MovementListView(generics.ListCreateAPIView):
    queryset = Movement.objects.all()
    serializer_class = MovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'movement', 'piece', 'game']

    def get_queryset(self):
        queryset = super().get_queryset()
        pk_gt = self.request.query_params.get('pk__gt')
        if pk_gt is not None:
            queryset = queryset.filter(pk__gt=pk_gt)
        return queryset
        
    def perform_create(self, serializer):
        serializer.save()
        movement_instance = serializer.instance
        process_movement_async.delay(movement_id=movement_instance.id)
        return Response(serializer.data)


class MovementDetailView(APIView):
    def get_object(self, pk):
        try:
            return Movement.objects.get(pk=pk)
        except Movement.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        movement = self.get_object(pk)
        serializer = MovementSerializer(movement, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        movement = self.get_object(pk)
        serializer = MovementSerializer(movement, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        movement = self.get_object(pk)
        movement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
