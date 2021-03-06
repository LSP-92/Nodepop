# Welcome to Nodepop

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)

> Second Hand Products Trading App

## Install

```sh
npm install
```

### Load initial data

You can load the database with initial data with:

```sh
npm run init_db
```

Warning! this script delete database contents before the load.
Use in production only in the first deployment.

### Usage

```sh
npm run start
```

### Run tests

```sh
npm run dev
```

## Install image converter

```sh
cd nodeapi/worker
npm install

```

## API

### **List of Ads**

GET/api

{
"tags": [
"lifestyle",
"motor"
],
"\_id": "5f5e012030f9c417ef8b40b2",
"name": "Bicicleta",
"state": "sell",
"price": 230.15,
"img": "bici.jpg",
"\_\_v": 0
},

- Filters
  - img : <http://localhost:3000/api?img=bici.jpg>
  - name : <http://localhost:3000/api?name=Iphone5>
  - price: <http://localhost:3000/api?price=125.85>
  - state : <http://localhost:3000/api?state=buy>
  - tags : <http://localhost:3000/api?tags=lifestyle&tags=mobile>
  - sort : <http://localhost:3000/api?sort=price>
  - Max price: <http://localhost:3000/api?mxPrice=20>
  - Min price: <http://localhost:3000/api?mnPrice=100>
  - In range price: <http://localhost:3000/api?mnPrice=100&mxPrice=200>
  - sort and skip : <http://localhost:3000/api?limit=1&skip=2>
- Error response : error: {600} data no found

### **Create ad**

POST/api/new {body: name: _required_, price: _required_, state: (buy || sell), tags: optionals, img: required }

- _response_: {'Ad create', newAd{}}

- _error response_ : error{
  400: error.message
  }

### **_Delete Ad_**

DELETE/api/del?\_id  
Returns: number of ads removed

### How to start a local mongodb instance for development

```ssh
./bin/mongod --dbpath ./data/db --directoryperdb
```

## Image COnverter

```sh
cd nodeapi/worker
npm start

```

### Image path

```sh
cd nodeapi/worker/img_converter

```

## Config files

Change name file .env copy to .env

Enter the required data

## Author

👤 **Luis Sanchez Prudencio**

- Github: [@LSP-92](https://github.com/LSP-92)
