# Restaurant Forum
A simple twitter project built with Node.js, Express, and MySQL


## Quick Look
![Project Look1](https://i.imgur.com/DRgjTJP.png)



## Demo
Try out our Restaurant Forum on [Demo URL](https://obscure-springs-01735.herokuapp.com/signin)

```
User
  account：user1@example.com
  password：12345678
Admin
  account：root@example.com
  password：12345678
```

## Features
| Functions              | Detail                                            | URL                         |
| :--------------------: | ------------------------------------------------- | --------------------------- |
| Sign up | User can sign up an account by inputting name, email, password | /signup |
| Log in | User can log in using registered email | /signin |
| Log out | User can log out of an account | /users/logout |
| Quick view all restaurants | User can view all restaurants | /restaurants |
| View detail of restaurant | User can view restaurant's detail | /restaurants/:id |
| add or remove favorite restaurant | User can add or remove restaurant from favorite list | /restaurants/:id |
| Comment to restaurant | User can add comment to restaurant | /comments |
| Top restaurants | User can view top 10 restaurants| /restaurants/top |
| View recent feeds | User can view the most recent feed | /restaurants/feeds |
| View all restaurants | Admin can view all restaurants | /admin/restaurants |
| Create a restaurants | Admin can add a new restaurant after login | /admin/restaurants/create |
| View a restaurant | Admin can view detail of a restaurant after login | /admin/restaurants/:id |
| Edit a restaurant | Admin can update detail info of a restaurant after login | /admin/restaurants/:id/edit |
| Delete a restaurant | Admin can delete a restaurant after login | /admin/restaurants/:id |
| View all users | Admin can view all users after log in | /admin/users |
| Edit a user | Admin can update user's role after log in | /admin/users/:id |



## Project setup
### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/YunYuLo/restaurant_forum.git
```

### Setup Datebase

**Create database via MySQL Workbench**

> Run the following code
```
drop database if forum;
create database forum;
```


### Setup App

**1. Enter the project folder**

```
$ cd restaurant_forum
```

**2. Install packages via npm**

```
$ npm install
```

**3. Create .env file**

```
$ touch .env
```

**4. Store API Key in .env file and save**

```
IMGUR_CLIENT_ID=<YOUR_imgur_ID>
JWT_SECRET=<YOUR_JWT_key>
```

**5. Edit password in config.json file**

> /config/config.json
```
"development": {
  "username": "root",
  "password": "<YOUR_WORKBENCH_PASSWORD>",
  "database": "forum",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

**6. Run migration & seeder**

> run the following code in the console
```
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```

**7. Activate the server**

```
$ npm run dev
```

**8. Find the message for successful activation**

```
> Example app listening on port 3000!
```
You may visit the application on browser with the URL: http://localhost:3000

```
User
  account：user1@example.com
  password：12345678
Admin
  account：root@example.com
  password：12345678
```


## Authors

 - [YunYuLo](https://github.com/YunYuLo)

