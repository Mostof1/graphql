# GraphQL Profile Project Documentation

## Project Overview
This project creates a personal profile dashboard that visualizes my school journey using GraphQL queries to fetch my educational data. It features a secure login system, displays key metrics, and presents interactive data visualizations using SVG.

## Live Demo
The project is deployed and accessible at: [https://myusuf-graphql.netlify.app](https://myusuf-graphql.netlify.app)

## Features Implemented

### 1. Authentication System
- Secure login with JWT token authentication
- Support for both username:password and email:password login methods
- Error handling for invalid credentials
- Logout functionality

### 2. Profile Information Display
The profile displays three key pieces of information as required:

**User Identification**
- Username display with personalized welcome message
- Avatar representation using first letter of username
- Basic user information from GraphQL user queries

**XP Information**
- Total XP earned throughout the program
- XP distribution by project/module
- Visual representation of XP accumulation over time

**Project/Grade Information**
- Total number of projects completed
- Success rate percentage
- Detailed breakdown of passed vs. failed projects

### 3. SVG Statistical Visualizations
I've implemented two interactive SVG-based visualizations:

**XP Progress Over Time Graph**
- Line chart showing XP accumulation throughout my journey
- Interactive data points with tooltips showing:
  - Date of XP earned
  - Amount of XP for that transaction
  - Total XP at that point
- Responsive scaling to accommodate different time periods
- Visual indicators for significant XP gains

**Project Success Ratio Graph**
- Interactive pie chart showing pass/fail ratio
- Click functionality to display detailed lists of projects
- Animated segments for better visualization
- Color-coded for easy interpretation (green for passed, red for failed)

## GraphQL Implementation
The project demonstrates all three required types of GraphQL querying:

### 1. Basic Queries
Fetching user information:
```graphql
query GetUser {
  user {
    id
    login
  }
}
```

### 2. Nested Queries
Fetching project data with related object information:
```graphql
query GetUserProgress {
  progress {
    id
    objectId
    grade
    createdAt
    path
    object {
      name
      type
    }
  }
}
```

### 3. Queries with Arguments
Fetching specific object details:
```graphql
query GetObject($objectId: Int!) {
  object(where: {id: {_eq: $objectId}}) {
    id
    name
    type
    attrs
  }
}
```

## Technical Implementation

### Authentication Flow
1. User submits credentials (username/email and password)
2. Credentials are encoded and sent to the authentication endpoint
3. JWT token is received and stored in localStorage
4. Token is used for authorization in GraphQL requests
5. User ID is extracted from the token for data fetching

### Data Visualization Approach
- Custom SVG elements for all visualizations
- Manually calculated scales and coordinates for precise control
- Interactive elements implemented with React state management
- Responsive design principles for cross-device compatibility

### Styling
- Dark-themed UI for reduced eye strain
- High contrast colors for accessibility
- Responsive layout for various screen sizes
- Consistent visual language across the application

## Running the Project Locally

1. Clone the repository:
```
git clone https://learn.reboot01.com/git/myusuf/graphql
cd graphql
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

5. Login with your credentials to view your profile

## Technologies Used
- React for the UI components
- JWT for authentication
- GraphQL for data fetching
- SVG for interactive data visualization
- Custom CSS for styling

## Project Structure
```
/graphql
  ├── /public
  │   ├── index.html
  │   ├── favicon.ico
  ├── /src
  │   ├── /components
  │   │   ├── Login.js
  │   │   ├── Profile.js
  │   │   ├── Navbar.js
  │   │   ├── /graphs
  │   │   │   ├── XpOverTime.js
  │   │   │   ├── ProjectsRatio.js
  │   ├── /services
  │   │   ├── auth.service.js
  │   │   ├── graphql.service.js
  │   ├── App.js
  │   ├── index.js
  │   ├── styles.css
```

## Conclusion
This project successfully demonstrates the use of GraphQL to create a profile page that visualizes my educational journey. Through interactive SVG visualizations, I've been able to present my progress and achievements in an engaging and informative way.