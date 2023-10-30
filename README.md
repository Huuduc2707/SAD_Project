# Parking Services

## Overview

Parking Services is a Django-based web application that provides a platform for managing parking reservations and vehicle information. This document guides you through the process of setting up and running the Parking Services server.

## Prerequisites

Ensure that you have the following installed on your system:

- [Python](https://www.python.org/) (version 3.6 or higher)
- [Django](https://www.djangoproject.com/)
- [Django Ninja](https://django-ninja.rest-framework.com/)

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/parking-services.git
   cd parking-services
   ```

2. **Create a Virtual Environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment:**

   - On Windows:

     ```bash
     .\venv\Scripts\activate
     ```

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run Migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser:**

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to create a superuser account. This account will have administrative access to the Django admin interface.

7. **Run the Development Server:**

   ```bash
   python manage.py runserver
   ```

   The development server will start, and you can access the application at `http://127.0.0.1:8000/`.

8. **Access the Django Admin Interface:**

   - Open your web browser and go to `http://127.0.0.1:8000/admin/`.
   - Log in with the superuser credentials created in step 6.

9. **Change Superuser Role to Manager:**

   - In the Django admin interface, go to the "Users" section.
   - Find the superuser account you created and click on it.
   - In the "Role" section, change to the "Manager" role.

10. **Access the API Documentation:**

    - Open your web browser and go to `http://127.0.0.1:8000/api/docs`.
    - Explore the API documentation provided by Django Ninja.

---

Happy parking! 🚗🅿️