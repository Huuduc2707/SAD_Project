# Generated by Django 4.2.6 on 2023-10-29 10:02

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('parking', '0006_bankaccount_reservation_checkin_bill'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='time_booked',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]