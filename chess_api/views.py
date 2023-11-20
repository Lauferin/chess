from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from .models import Movement
from .serializers import *


@api_view(['GET', 'POST'])
def movements_list(request):
    if request.method == 'GET':
        data = Movement.objects.all()

        serializer = MovementSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MovementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
