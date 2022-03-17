# pizzamobile-backend
Backend of PizzaMobile


## Vhost configurazion
<VirtualHost *:80>
    DocumentRoot "/Users/geronimo.weibel/Documents/projects/pizzamobile-backend/api/public"
    ServerAlias pizzamobil.local
    ServerName api.pizzamobil.local
    <Directory "/Users/geronimo.weibel/Documents/projects/pizzamobile-backend/api/public">
        Order allow,deny
        Allow from all
        Require all granted
    </Directory>
</VirtualHost>