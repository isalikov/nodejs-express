# express-rest environment

This directory not part of api application but contain all required services and can be used as example


#### Services
- **nginx** - Nginx, application hosts router
- **mongo** - MongoDB, application storage
- **redis** - Redis, cache layer
- **postgres** - PostreSQL, Sentry storage
- **sentry** - Sentry Instance
- **cron** - Sentry Cron
- **worker** - Sentry Worker

#### Hosts
```
127.0.0.1        express-rest.local
127.0.0.1        api.express-rest.local
127.0.0.1        sentry.express-rest.local
```

#### Running
- pull images: `docker-compose pull`
- run services: `docker-compose up -d`

#### Sentry setup
- copy `.env-example` as `.env` and paste secret key
- generate secret key: `docker-compose run --rm sentry config generate-secret-key`
- run migrations: `docker-compose run --rm sentry upgrade`
