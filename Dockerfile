FROM php:7.2.3-fpm

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN apt-get update \
    && apt-get install -y vim curl debconf subversion git apt-transport-https apt-utils \
    build-essential locales acl mailutils wget zip unzip \
    gnupg gnupg1 gnupg2

COPY .docker/php/scripts/app.ini /etc/php/7.2.3/php.ini
COPY .docker/php/scripts/php-fpm.conf /etc/php/7.2.3/pool.d/www.conf

COPY .docker/php/scripts/composer.phar /usr/local/bin/composer
#RUN curl -sSk https://getcomposer.org/installer | php -- --disable-tls && \
#   mv composer.phar /usr/local/bin/composer

RUN groupadd dev -g 999
RUN useradd dev -g dev -d /home/dev -m

RUN rm -rf /var/lib/apt/lists/*
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen

WORKDIR /home/wwwroot/

COPY . .

COPY .docker/php/scripts/run.sh .

EXPOSE 9000
ENTRYPOINT /home/wwwroot/run.sh
