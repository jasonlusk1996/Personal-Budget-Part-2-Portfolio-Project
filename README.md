# Personal-Budget-Part-2-Portfolio-Project

## Description

This is the third portfolio project for the CodeCademy back-end developer career course. This project is intended to manage the budget of different expenses and trasactions. This project uses a PostgreSQL database to manage envelopes and transactions, with data accessed via raw SQL queries within Express routes. Using JavaScript functions, express routes, and SQL statements, this project runs a server and allows the user to retrieve and change the information relating to an envelope and/or transaction. Examples of requests that users can make is listed below.

### Envelopes:
----
 - Retrieve envelopes using `GET /envelopes`
 - Retrieve a single envelope using `GET /envelopes/{id}`
 - Create an envelope using `POST /envelopes`
 - Updates the budget of a specific envelope using `PUT /envelopes/{id}`
 - Delete an envelope using `DELETE /envelopes/{id}`
 - Updates all envelopes to have the same budget amount using `PUT /envelopes/even`
 - Transfer budget between envelopes using `POST /envelopes/transfer/{from}/{to}`
 - Withdraws a specified amount from a specific envelope using `POST /envelopes/{id}/withdraw`

### Transactions:
___
 - Retrieve transactions using `GET /transactions`
 - Create a new transaction using `POST /transactions`
 - Sorts all transactions to show largest payment amount first using `GET /transactions/max`
 - Sorts all transactions to show smallest payment amount first using `GET /transactions/min`
 - Gets all transactions related to a certain envelope using `GET /transactions/envelope/{id}`
 - Retrieve a single transaction using `GET /transactions/{id}`
 - Change which envelope a transaction belongs using `POST /transactions/{id}/transfer`
 - Delete an envelope using `DELETE /transactions/{id}`

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **API Documentation:** Swagger/OpenAPI
* **Language:** JavaScript and SQL

## Getting Started

1. Clone the repository: `git clone https://github.com/jasonlusk1996/Personal-Budget-Part-2-Portfolio-Project.git`
2. Install dependencies: `npm install`, then `npm start`
3. Start the server: `node server.js`
4. Access the API at `http://localhost:3000/`
5. Swagger documentation and testing available at `http://localhost:3000/api-docs/`