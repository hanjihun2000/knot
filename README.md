# Knot - Weaving Stories, Building Communities

Knot is a community-oriented social platform designed to foster connections and interactions among users through story sharing and community building. The application allows users to create, follow, comment, and manage posts within a supportive environment.

## Project Description

### What does the project do?

Knot provides a platform for users to:
- Register and manage user accounts.
- Follow other users and manage follow requests.
- Create, edit, and comment on posts.
- Search for users and content.
- Administer user activities and content (Admin roles).

### Why these technologies?

We chose technologies such as React for the front end for its reusable components and efficient updates, Node.js for the backend for its non-blocking I/O capabilities, and MongoDB for a flexible, schema-less database that scales well. These choices support a robust, scalable app architecture that can handle dynamic community interactions.

### Future Implementations

- Implementing real-time notifications.
- Enhanced privacy settings.
- Machine learning algorithms for personalized content recommendations.

## Installation and Running the Project

### Prerequisites

Ensure you have Node.js and npm/yarn installed:
```bash
node --version
npm --version
# or
yarn --version
```

### Installation

Clone the repository:
```bash
git clone https://github.com/hanjihun2000/knot-csci3100-project.git
cd knot-csci3100-project
```

Install dependencies:
```bash
cd client
npm install
cd ../server
npm install
```

### Setting Up the Database

1. Create a `.env` file in the `server` directory.
2. Add the following environment variables:
```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

### Running the Application

To run the server:
```bash
cd server
npm start
cd ../client
npm start
```

Access the application at `http://localhost:3000`.

## How to Use the Project

After running the project, you can:
- Sign up to create a new account.
- Edit your profile information.
- Explore user profiles and follow/unfollow users.
- Create and edit your posts.
- Comment and interact on posts.
- Search for specific users.

## Credentials Required

To access admin functionalities, please login with the following credentials:
  - Username: `admin`
  - Password: `admin`



## Collaborators

- [Cheng Chung Hei Sennett](#)
- [Hon Kwan Shun Quinson](#)
- [Daniel Sharjil Huq](#)
- [HAN Jihun](#)
- [Josiah Olyver Lee Yong Zhi](#)

## References

This project was inspired by and adapted from several UML and software design pattern resources, including [Design Patterns for Humans](https://github.com/kamranahmedse/design-patterns-for-humans).

## Licence

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Additional Sections

### Badges

![GitHub followers][]![GitHub stars][]### Bug TrackerReport bugs at our [Issues page](https://github.com/your-github/knot/issues).### ContributingPlease read [CONTRIBUTING.md](CONTRIBUTING) for details on our code of conduct, and the process for submitting pull requests to us.### TestsRun tests using:```bashnpm test# oryarn test```## Authors and AcknowledgementsTeam Group D6 of the Department of Computer Science and Engineering, The Chinese University of Hong Kong. Special thanks to our mentor Dr. XYZ and all contributors.## Future Release Plans- Version 2.0: Integration of AI to enhance user interaction.- Version 2.1: Addition of multi-language support.