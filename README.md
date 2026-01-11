Rating Platform - Store Rating System 

The Rating Platform is a full stack web application that allows users to discover stores, submit ratings and helps store owners and administrators manage everything smoothly.

------------------------------------------------------------

Features

System Administrator 👑  
Dashboard shows total users, stores and ratings  
Can add new users such as Admin, Normal User and Store Owner  
Can add and manage stores  
Advanced search and filtering by name, email, address and role  
Can view detailed user profiles and store ratings  

Normal User 
Can register and login with proper validation  
Can browse stores using search  
Can submit and update ratings from 1 to 5 stars  
Can change password  
Responsive personal dashboard  

Store Owner 
Can see average store rating  
Can view customers who rated their store  
Can change password  
Has analytics dashboard for ratings  

------------------------------------------------------------

Quick Start

Prerequisites  
Node.js version 14 or higher  
MySQL  
npm  

------------------------------------------------------------

Installation Steps

Step 1 Clone the Repository  
git clone https://github.com/yourusername/rating-platform.git  
cd rating-platform  

Step 2 Set Up Database  
mysql -u root -p < database.sql  

Step 3 Configure Backend  
cd backend  
npm install  
Update the .env file with your MySQL credentials  

Step 4 Configure Frontend  
cd frontend  
npm install  

Step 5 Run the Application  

Terminal 1 Backend runs on port 5001  
cd backend  
npm run dev  

Terminal 2 Frontend runs on port 3000  
cd frontend  
npm start  

------------------------------------------------------------

Access Points

Frontend Application  
http://localhost:3000  

Backend API  
http://localhost:5001  

API Test Endpoint  
http://localhost:5001/api/test  

------------------------------------------------------------

Default Login Credentials

| Role        | Email              | Password   | Access Level          |
|------------|-------------------|------------|-----------------------|
| Admin      | admin@rating.com  | Admin@123  | Full system access    |
| StoreOwner | store@example.com  | Store@123  | Store management     |
| NormalUser | user@example.com   | User@123   | Store rating         |

------------------------------------------------------------

Project Structure

rating-platform  
backend  
server.js  
package.json  
.env  

frontend  
src  
App.js  
styles.css  
package.json  

database.sql  

------------------------------------------------------------

Technology Stack

| Component       | Technology  | Description           |
|-----------------|-------------|-----------------------|
| Frontend        | React.js    | User interface        |
| Backend         | Express.js  | REST API server       |
| Database        | MySQL       | Data storage          |
| Authentication  | JWT Bcrypt  | Secure login          |
| Styling         | Custom CSS  | Cream color theme     |

------------------------------------------------------------

API Endpoints

Authentication  
POST /api/register  
POST /api/login  

Admin Features  
GET /api/admin/dashboard/stats  
GET /api/admin/users  
POST /api/admin/users  
POST /api/admin/stores  

User Features  
GET /api/stores  
POST /api/ratings  
PUT /api/users/password  

Store Owner Features  
GET /api/store-owner/dashboard  

------------------------------------------------------------

Form Validations

| Field    | Rule                                      |
|----------|-------------------------------------------|
| Name     | 20 to 60 characters                       |
| Email    | Standard email format                     |
| Address  | Maximum 400 characters                    |
| Password | 8 to 16 characters with uppercase and symbol |

------------------------------------------------------------

Troubleshooting

Reset Database  
mysql -u root -p rating_platform < database.sql  

Test Login  
curl -X POST http://localhost:5001/api/login  
-H "Content-Type: application/json"  
-d '{"email":"admin@rating.com","password":"Admin@123"}'  

------------------------------------------------------------

Development Notes

Backend runs on port 5001  
Frontend runs on port 3000  
Database name is rating_platform  
Passwords are encrypted using bcrypt  
All APIs return JSON  

------------------------------------------------------------

Contributing   
Fork the repository  
Create a new branch  
Commit your changes  
Push the branch  
Open a pull request  

------------------------------------------------------------

Support  
If you like this project, please give it a star on GitHub

Created by Sanskruti Gadekar
