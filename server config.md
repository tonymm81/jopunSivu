### Serer script

1. Asenna UpCloud CLI seuraavalla komennolla:
bash
curl -sSL https://cli.upcloud.com/install.sh | sudo bash

2. Luo uusi palvelin UpCloudissa
Kirjaudu sisään UpCloud-hallintapaneeliin.

Valitse "Deploy Server" ja määritä palvelimen asetukset (esim. sijainti, käyttöjärjestelmä, resurssit).

Valitse käyttöjärjestelmäksi esimerkiksi Ubuntu 20.04 LTS.

Nimeä palvelin ja klikkaa "Deploy".

3. Yhdistä palvelimeen SSH:lla
Kun palvelin on luotu, yhdistä siihen SSH:lla:

bash
ssh root@your-server-ip
4. Asenna Node.jsja npm
Asenna Node.jsja npm seuraavilla komennoilla:

bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
5. Luo Node.jsExpress -sovellus

6. Asenna ja määritä PM2
Asenna PM2 prosessinhallinta:

bash
npm install pm2 -g
Käynnistä sovellus PM2:lla:

bash
pm2 start index.js
Tallenna PM2-konfiguraatio:

bash
pm2 save
Määritä PM2 käynnistymään automaattisesti palvelimen käynnistyessä:

bash
pm2 startup
7. Asenna ja määritä Nginx
Asenna Nginx:

bash
sudo apt-get install nginx
Määritä Nginx toimimaan käänteisenä välityspalvelimena. Luo uusi konfiguraatiotiedosto:

bash
sudo nano /etc/nginx/sites-available/myapp tee tää vasta sudo ln-s jälkeen
Lisää seuraava konfiguraatio:

nginx: HUOM tämä on http

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Ota konfiguraatio käyttöön:#

bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
8. Määritä verkkotunnus

Kirjaudu sisään Domainhotellin hallintapaneeliin.#

Lisää A-tietue, joka osoittaa UpCloud-palvelimesi IP-osoitteeseen:

A-tietue: yourdomain.com -> your-server-ip
9. Testaa ja varmista
Odota muutama tunti, jotta DNS-muutokset leviävät.

Tähän build versioon;
Tee filu. eli tällä saadaa build kansiosta sivu käyntiin.

ecosystem.config.js


module.exports = { apps: [ { name: 'my-app', script: './dist/index.js', cwd: 
                            './', watch: true, env: { NODE_ENV: 'development', }, 
                            env_production: { NODE_ENV: 'production', 
                            }, }, ], };

tää sitten käyntiin komennolla: pm2 start ecosystem.config.js --env production

### palomuri 
- sudo ufw status sudo ufw allow 3002 sivulle   
- sudo ufw status sudo ufw allow 80 selaimen portille
- sudo ufw allow 443 - https
- sudo ufw allow 20


### https yhteys

- sudo apt update 
- sudo apt install certbot python3-certbot-nginx
- sudo certbot --nginx -d joukomaenpaa.fi -d www.joukomaenpaa.fi
- . Tarkista Nginx-konfiguraatio
Varmista, että Nginx-konfiguraatiossa on oikeat asetukset HTTPS-yhteyttä varten. Konfiguraatiotiedoston tulisi näyttää tältä:

nginx
server {
    listen 80;
    server_name joukomaenpaa.fi www.joukomaenpaa.fi;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name joukomaenpaa.fi www.joukomaenpaa.fi;

    ssl_certificate /etc/letsencrypt/live/joukomaenpaa.fi/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/joukomaenpaa.fi/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
4. Käynnistä Nginx uudelleen
Käynnistä Nginx uudelleen, jotta muutokset tulevat voimaan:

bash
sudo systemctl restart nginx
5. Uusi SSL-sertifikaatti automaattisesti
Let's Encrypt -sertifikaatit ovat voimassa 90 päivää, mutta Certbot voi uusia ne automaattisesti. Voit testata automaattisen uusimisen seuraavalla komennolla:

bash
sudo certbot renew --dry-run
Näillä ohjeilla voit määrittää HTTPS-yhteyden Nginx-palvelimella käyttämällä Let's Encrypt -sertifikaattia. 



sudo systemctl restart nginx
5. Odota DNS-muutosten päivittymistä
DNS-muutosten päivittyminen voi kestää jopa 24 tuntia, joten ole kärsivällinen.


Päivitetty versio, jossa ei pitäs olla sivua ei löydy virhettä:
server {
    listen 80;
    server_name joukomaenpaa.fi www.joukomaenpaa.fi;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS-palvelin
server {
    listen 443 ssl;
    server_name joukomaenpaa.fi www.joukomaenpaa.fi;

    ssl_certificate /etc/letsencrypt/live/joukomaenpaa.fi/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/joukomaenpaa.fi/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
