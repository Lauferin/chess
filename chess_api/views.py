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


class MovementListView(generics.ListCreateAPIView):
    queryset = Movement.objects.all()
    serializer_class = MovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'movement', 'piece']

    def perform_create(self, serializer):
        # Save the movement
        print("hi")
        serializer.save()

        # Get the movement instance
        print("hii")
        movement_instance = serializer.instance

        # Trigger asynchronous processing
        print("hiii")
        process_movement_async.delay(movement_instance.id)

        # Respond with success
        print("hiiii")
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

# @api_view(['GET', 'PUT', 'DELETE'])
# def movements_detail(request, pk):
#     try:
#         movement = Movement.objects.get(pk=pk)
#     except Movement.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = MovementSerializer(movement, context={'request': request})
#         return Response(serializer.data)

#     if request.method == 'PUT':
#         serializer = MovementSerializer(movement, data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         movement.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
