This project is still in development.

In the meantime, it's possible to move the white piece in the front-end.



In order to install all the project after you clone:

- set up python 3, pip and nodeJS.
- create a virtual environment and enter it (python -m venv env, source ./env/bin/activate)
- set up django: pip install django djangorestframework django-cors-headers
- I haven't tried to clone yet, so I'm not sure how the database and other stuff is generated. In any case, you can run django-admin startproject django_react_proj and reorder files. And then python manage.py makemigrations and python manage.py migrate.
- inside the frontend folder, npm install

To run everything:
- in backend (main folder), ./manage.py runserver (after activating virtual environment)
- in frontend, npm run start
