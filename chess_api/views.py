from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from .models import Game, Movement
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics


class GameListView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class MovementListView(generics.ListCreateAPIView):
    queryset = Movement.objects.all()
    serializer_class = MovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['player', 'movement', 'piece']


@api_view(['GET', 'PUT', 'DELETE'])
def movements_detail(request, pk):
    try:
        movement = Movement.objects.get(pk=pk)
    except Movement.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MovementSerializer(movement, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = MovementSerializer(movement, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        movement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def handle_webhook(request):
    data_from_frontend = request.POST.get('data', {})
    # Process the data as needed

    return JsonResponse({'status': 'success'})
