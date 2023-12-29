from django.urls import path
from . import views

urlpatterns = [
    path('movements/', views.MovementListView.as_view(), name='movement-list'),
    path('movements/<int:pk>/', views.MovementDetailView.as_view(), name='movement-detail'),
    path('games/', views.GameListView.as_view(), name='game-list'),
]