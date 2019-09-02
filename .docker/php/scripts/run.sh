#!/usr/bin/env bash

sleep 5

php artisan key:generate
php artisan config:cache

#php artisan migrate

php-fpm
