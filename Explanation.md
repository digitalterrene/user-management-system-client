# Explanation of My App: Cool Kids Network

Hi there! This is my documentation for the **Cool Kids Network** app I created as part of the assignment. Below, I’ll explain the problem I solved, how the app works, the decisions I made, and why. I’ll also share how my solution meets the assignment’s requirements.

---

### Problem Statement (in my own words)

The Cool Kids Network is a platform where users can sign up and interact with characters that are automatically generated for them. Depending on their role, users can access different features like viewing their own character’s data or seeing other users’ information. Additionally, admins (maintainers) can assign roles to users via an API.

The main tasks include:

1. Allowing users to register and create their characters.
2. Enabling users to log in and view their character details.
3. Restricting access to certain features based on user roles.
4. Allowing admins to update user roles securely.

---

### How the App Works (User Stories)

#### **User Story 1: Sign-Up Process**

- When a new user visits the homepage, they see a **Sign-Up** component and button. Putting an email in the email field and clicking "Confirm" button sends a request to the server.
- Once they enter their email and click "Confirm," the app:
  1. **Fetches a random user** from the `randomuser.me` API to generate their character (first name, last name, and country).
  2. Assigns their email and sets their default role as **Cool Kid**.
  3. Sends a request to the server to create the user in the database.
  4. The server validates the email (checks if it’s unique) and assigns a default password for simplicity (since passwords aren’t required for this proof of concept).
  5. If the account creation succeeds, the server responds with an **authentication token**.
- The token is stored securely on the client side, allowing the user to stay logged in. After this, the homepage switches to the user’s **Profile Page** component.

---

#### **User Story 2: Log In and View Profile**

- If a user has already signed up, they’re logged in automatically using the token from their previous session.
- Logged-in users see their profile on the homepage. This profile shows their:
  - First name
  - Last name
  - Country
  - Email
  - Role
- If a user has another account, they can log out and sign in again using their email. The app validates the email and returns a new token if it matches an existing account. Otherwise, the login fails.

---

#### **User Story 3: Viewing Other Users’ Data**

- Users with the **Cooler Kid** or **Coolest Kid** roles can access the `/users` page, which displays a list of all users. However:
  - **Cooler Kid** users can only see the names and countries of other users.
  - **Coolest Kid** users can see names, countries, emails, and roles.

---

#### **User Story 4: Coolest Kid Privileges**

- On the `/users` page, if a logged-in user has the **Coolest Kid** role, they see the complete data for all users (names, countries, emails, and roles).
- If their role changes (e.g., back to **Cool Kid**), their access is restricted accordingly.

---

#### **User Story 5: Updating Roles as a Maintainer**

- Logged-in users with the right permissions can visit the `/maintainer` page. Here:
  - They see a form to search for a user using their email or their first and last name.
  - If they have the **Cooler Kid** or **Coolest Kid** role, they can send a request to update the target user’s role.
  - The server validates the request and, if successful, updates the role in the database.
  - If the logged-in user is not authorized (e.g., a regular **Cool Kid**), the server rejects the request.

---

### Technical Specification and Decisions

- **Frontend:** I used Nextjs with React for its component-based architecture, which made it easy to build reusable components for the forms, profile, and user lists.
- **Backend:** I chose Node.js with Express for the server. It’s lightweight and efficient, and I’m comfortable using it to handle API requests and manage a database.
- **Database:** I used a MongoDB database.
- **Authentication:** Tokens are used for authentication. In production, they’re stored securely as `httpOnly` cookies for added security.
- **Random Data Generation:** The app integrates with the `randomuser.me` API to create unique characters for each user.

---

### How My Solution Meets the Assignment Requirements

- **Complete Functionality:** My app delivers all features from the user stories:
  - Users can sign up, log in, and view their data.
  - Role-based access works correctly for viewing and updating user data.
  - Maintainers can update roles through a secure API.
- **Technical Soundness:** The app follows modern practices:
  - Object-Oriented Programming (OOP) is used for reusable models and services.
  - Error handling and logging ensure resilience and observability.
- **User-Friendly Design:** The interface is clean and intuitive, allowing easy navigation between features.
- **GitHub Repository:** The code is version-controlled on GitHub with clear commit messages documenting the development process.
- **Future-Ready:** While this is a proof of concept, the app can be extended easily for production use by adding features like password authentication.

---

### Closing Thoughts

This project was an exciting challenge! It allowed me to demonstrate my skills in building a full-stack application while solving real-world problems like role-based access control. If you have any questions or feedback, I’d be happy to hear them. 😊
