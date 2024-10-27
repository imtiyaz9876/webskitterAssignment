# webskitterAssignment
# User Management API

## Overview
This project implements a MongoDB database and a set of RESTful APIs using TypeScript to manage users, categories, and questions. It includes functionalities for user authentication, profile management, category management, and bulk question addition.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Testing the APIs](#testing-the-apis)
- [Error Handling](#error-handling)
- [Postman Collection](#postman-collection)
- [License](#license)

## Technologies Used
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- CSV Parser
- Joi (for validation)

## Database Structure
The database consists of the following collections:
1. **Users**
   - Fields: `name`, `email`, `mobile`, `gender`, `password`, `image`, `role`

2. **Categories**
   - Fields: `name`, `description`

3. **Questions**
   - Fields: `content`, `categories` (array of category IDs)

## API Endpoints
| Method | Endpoint                                | Description                                   |
|--------|-----------------------------------------|-----------------------------------------------|
| POST   | /api/register                           | Register a new user                          |
| POST   | /api/login                              | User login                                   |
| GET    | /api/profile                            | View user profile                            |
| PUT    | /api/update-profile-user               | Edit user profile (with profile picture)    |
| POST   | /api/catagory                          | Create a new category                        |
| GET    | /api/getAllCategory                    | Get all categories                           |
| POST   | /api/createQuestion                     | Create a new question                        |
| GET    | /api/questionCategoryWise/:categoryName | Get questions for a specific category       |
| POST   | /api/questions/bulk                    | Add questions in bulk from a CSV file       |

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone git@github.com:imtiyaz9876/webskitterAssignment.git
   cd repo-name
   postmanCollectionLink=https://documenter.getpostman.com/view/30345969/2sAY4sjQF1

npm install
APP_PORT=your_port_number
DB_URL=your_mongodb_connection_string
npm run start
