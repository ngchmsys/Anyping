from django.urls import path

from . import views

app_name = 'anyping'
urlpatterns = [
    path('', views.index, name='index'),
    path('pyping/', views.pyping, name='pyping'),
    path('pyping/api/', views.pyping_api, name='pyping_api'),
]
