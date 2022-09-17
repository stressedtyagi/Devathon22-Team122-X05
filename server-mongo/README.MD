### Setup

```bash
npm install && npm start
```

### Swagger (API-DOCS)

Read and test the API using swagger UI docs using [this link](https://jobify-server-dt.herokuapp.com/api-docs)

### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

### Routers

-   #### auth.js
    ```yaml
    /:
        type: POST
        description: "check authentication of user"
    /register:
        type: POST
        description: "register new user"
    /login:
        type: POST
        description: "login existing user"
    ```
-   #### jobs.js
    ```yaml
    /:
        type: POST
        description: "create new job"
    /:
        type: GET
        description: "get all jobs for current user"
    /{id}:
        type: PATCH
        description: "update existing job"
    /{id}:
        type: GET
        description: "get job with jobID"
    /{id}:
        type: DELETE
        description: "delete job"
    ```

### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

-   Preprocessor
    -   pre : convert password into encrypted form before saving into mongoDB
-   Methods
    -   createJWT : create JWT token for user authentication
    -   comparePassword : compare incoming JWT to passwords in DB for user login authentication

### Job Model

Store used information, with following schema

-   company : maxLength `40`
-   position : maxLength `30`
-   status : [`interview, pending, declined, accepted`]
-   createdBy : user(ObjectId)
-   TimeStamps : True

### Register User

-   Validate - name, email, password - with Mongoose
-   Hash Password (with bcryptjs)
-   Save User
-   Generate Token
-   Send Response with Token

### Login User

-   Validate - email, password - in controller
-   If email or password is missing, throw BadRequestError
-   Find User
-   Compare Passwords
-   If no user or password does not match, throw UnauthenticatedError
-   If correct, generate Token
-   Send Response with Token

### Auth User

-   Check for authorization header
-   Check for bearer header
-   Verify JWT token using JWT_SECRET
-   If authentication failed throw UnauthenticatedError
-   Send response with ok status with payload received after verifying token

### Mongoose Errors

-   Validation Errors
-   Duplicate (Email)
-   Cast Error

### Security

-   helmet
-   cors : Ensures that API is accessable from different domains
-   xss-clean : Sanitizes user input in req.body, req.query, req.params. Protect from cross-site scripting attack
-   express-rate-limit : limit the amount of request user can make

Swagger UI

```yaml
/jobs/{id}:
    parameters:
        - in: path
          name: id
          schema:
              type: string
          required: true
          description: the job id
```

.env values

```yaml
MONGO_URI: MongoDB database connection link
JWT_SECRET: JWT Secret Value
JWT_LIFETIME: Lifetime of JWT token sended to client (eg 30d, 12d ...etc)
```
