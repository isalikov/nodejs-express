# express-boilerplate

- Authentication
- Express
- Mongoose
- Socket.io
- ES7 syntax

#### Running
```bash
docker-compose up -d
```

#### Environment Setup

Run services:
```
docker-compose -f ./docker-services.yml up -d
```

Run application:
```
yarn start
```

#### Environment variables
```
USER_EMAIL = [initial user email] | admin@root - is default
USER_PASSWORD = [initial user password] | rootroot - is default
```
