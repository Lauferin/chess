This is a chess game, user against the computer.

This project is still under development.


In order to install all the project after you clone:

- set up python 3, pip and nodeJS.
- create a virtual environment and enter it (python -m venv env, source ./env/bin/activate)
- set up django: pip install django djangorestframework django-cors-headers
- download rabbitMQ, follow these instructinons: https://www.rabbitmq.com/install-debian.html#apt-quick-start-cloudsmith
- install celery rabbitMQ: pip install celery[rabbitmq]
- optional: pip install flower

- I haven't tried to clone yet, so I'm not sure how the database and other stuff is generated. In any case, you can run django-admin startproject django_react_proj and reorder files. And then python manage.py makemigrations and python manage.py migrate.
- inside the frontend folder, npm install

To run everything, open three terminals:
- backend terminal (from chess_proj/): ./manage.py runserver (after activating virtual environment)
- celery terminal (from chess_proj/): celery -A chess_proj worker --loglevel=info
- frontend terminal (from chess_proj/chess-fe): npm run start
