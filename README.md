# lifeNote
A website app to organize and save the information users need.

This is a web app I created to help remember things! When I had first started making this app, our first child was born and life became a little more chaotic. I wanted to challenge myself and build an app to help me and others remember the various people or things we encounter day to day. I was doing a Udemy course on web development that taught basic CRUD operations for a Node.js site using MongoDB. From there I built my own app that allows users to create an account and create notes about different topics. For example, I want to learn more about investing, so with LifeNote I can create a note about the difference between stocks and bonds. In the future, I can also edit that note with more information or delete it if needed. I also added a feature where users are able to search notes by title to save on scrolling! This app was quite a challenge since I have primary used MySQL in the past. MongoDB is lightweight and easier to make changes to the database, but creating  relationships is harder than in SQL. I want to share this with people and hope it helps organize their lives a little bit. 

Technologies Used

For a responsive modern looking website, I used Bootstrap so that the content will resize for various screens. The pages were created utilizing HTML and the content was formatted with CSS. I also used jQuery for some custom animations. For the server side, I used Express and Node.js to build the server and the routes. I utilized the packages nodemailer to create a form users can contact me with and Passport.js for protecting users' passwords and user authentication. 

Features

Again, this is a responsive web app that reformats content to different screen sizes. Users can reach out to me directly with the form on the contact page. Accounts can be created for users, their passwords are then hashed and salted by Passport.js. Once the account is created, users can create, edit and delete their own notes. A search bar allows the user to search through their various notes. The passwords can also be changed within the profile. 

Challenges

Early on in development, I fell into the trap of coming up with too many features. My time could have been better spent sticking with the core features of the app of creating, updating and deleting notes along with the user login system. Another challenge was the learning curve for using Node.js and MongoDB. I have used MySQL in the past and it is easier to build relationships between items in the database. However, there are no transactions in this app and MongoDB is far easier and more flexible to work with user data. Using Mongoose with MongoDB makes it even easier to interact with the database. I had planned to host the app on heroku becuase I am familar with the platform, but they recently cut their free tier accounts. After some researching I found out railway can host node.js apps with mongoDB databases. So this app is hosted on railway. The development for this app took a lot of time researching and testing to accomplish the necessary features. These challenges were learning opportunities and I have a better understanding of my current capabilities along with a new skillset!

Link to Live Demo - https://youtu.be/XM6DNkFl9-E 

Pivotal Tracker Documentation (please view the project history tab)  - https://www.pivotaltracker.com/n/projects/2580737
