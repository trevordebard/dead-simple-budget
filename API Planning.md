# API Planning

## Data Model

Insight:

Why do we need the concept of a budget? This adds uneccesary complexity and lookups in the app when in reality all that matters is that one user can have a list of many stacks. 

Action:
- Remove budget entirely from the data model
- Change user data model to contain an array of stacks
- Add "category" to the stack data model to enable future UI stack organizaion. For example, categories might be "Needs," "Wants," "Vacations," etc.

## API Routes

transactions
- GET
  - Get all transactions for a user id
  - Requirements:
    - user id
  
transaction
- DELETE
  - Delete one or many transactions
  - Required params:
    - user id
    - transaction id(s)
- POST
  - Create one transaction
  - Required params
    - user id
    - description
    - stack 
    - amount 
    - type 
    - email 
    - date

transaction/[id]
- GET 
  - get a transaction of the specified id 
  - user must be logged in 
- PUT
  - update specified transaction
  - Required params:
    - transaction id
    - user id
  - Optional params:
    - description
    - stack 
    - amount 
    - type 
    - email 
 - DELETE
  - Delete one transaction
    - link into a function created from the /transaction DELETE route
  - Required params:
    - user id
    - transaction id(s)
    - date

stack
- POST
  - Create a new stack
  - Required params:
    - label
    - these fields most be unique to the budget they are in
  - Optional params:
    - amount
- PUT
  - Update a stack
  - User must be logged in
  - Required params:
    - stack id or (label & budget id)
- GET
  - retrieve a list of stacks that exist for a specific user
  - Required params:
    - user id

user
- POST
  - This route should not exist. NextAuth should handle user creation
  

