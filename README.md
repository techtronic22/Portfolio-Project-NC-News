Northcoders News API Guide
Developers, take note: To establish a connection with the databases, you must set up two environment (.env) files. The first is for the test database, and the second for the primary development database. Within these files, input "PGDATABASE=" followed by the respective database name. Once set up, ensure proper linkage with dotenv.

Cloud Application Link:
https://nc-news-backend-s2kz.onrender.com/

Project Overview:
This component is a segment of a more extensive project where I'm developing a comprehensive application for a news website. The backend of this project utilizes a Restful API and is supported by a PSQL database, interfaced through node-postgres. With the provided API endpoints, users can perform a variety of actions, including reading and posting articles, voting on articles, commenting, and filtering content based on specific criteria. For a detailed list of available API endpoints, refer to the endpoints.json file.

Tech Stack:

JavaScript
Express
PostgreSQL
Node.js
node-Postgres
Jest
Husky
SuperTest
Setup Instructions:

Fork the Repository: Navigate to the public nc-news project repository on my GitHub and click on the fork button.

Clone Your Fork: Post-forking, you'll find the project in your GitHub repositories with your username prefixed to the repo name. Copy the URL.

Clone to Local: In your terminal, use the command git clone [your-forked-repo-link].

Authentication: If prompted, enter your GitHub credentials. For the password, use a personal access token, available in your GitHub settings.

Local Setup: After cloning, open the project in your code editor.

Install Dependencies: Within the project directory in your terminal, run npm install.

Seed the Database: Execute npm run setup-dbs followed by npm run seed to populate the database with sample data.

View the Database: Use psql [database-name] in the terminal, followed by desired psql commands.

Run Tests: Input npm t to execute the project tests.

Version Requirements:

Node: v20.2.0 or higher
PostgreSQL: 14.8 or higher

Author: Saad Ahmad Qureshi