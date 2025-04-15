# GraphQL Profile Project

This project is a user profile page built using GraphQL to display school information from the platform's API. It includes authentication, data visualization, and interactive components.

## Features

- **JWT Authentication**: Secure login with username/email and password
- **User Profile Display**: Shows basic user information
- **XP Statistics**: Visual representation of XP earned over time
- **Project Analysis**: Pass/Fail ratio and project performance
- **Skills Display**: Visualization of user's skills based on XP
- **Interactive SVG Graphs**: Data visualization using SVG
- **Responsive Design**: Works across various device sizes

## Technology Stack

- React.js for the frontend UI
- GraphQL for data fetching
- JWT for authentication
- SVG for interactive data visualization
- CSS for styling

## Project Structure

```
/graphql-profile
  ├── /public
  │   ├── index.html
  │   ├── favicon.ico
  ├── /src
  │   ├── /components
  │   │   ├── Login.js      # Login form with authentication
  │   │   ├── Profile.js    # Main profile display
  │   │   ├── Navbar.js     # Navigation bar with logout
  │   │   ├── /graphs
  │   │   │   ├── XpOverTime.js        # SVG graph for XP over time
  │   │   │   ├── ProjectsRatio.js     # SVG graph for project ratios
  │   ├── /services
  │   │   ├── auth.service.js          # Authentication functions
  │   │   ├── graphql.service.js       # GraphQL query functions
  │   ├── /utils
  │   │   ├── jwtDecoder.js            # JWT handling utilities
  │   ├── App.js                       # Main application component
  │   ├── index.js                     # Application entry point
  │   ├── styles.css                   # Global styles
  ├── package.json
  ├── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/graphql-profile.git
   cd graphql-profile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the GraphQL endpoint and authentication URLs:
   - Open `src/services/auth.service.js` and update the authentication URL
   - Open `src/services/graphql.service.js` and update the GraphQL endpoint

4. Start the development server:
   ```
   npm start
   ```

### Building for Production

To create a production build:
```
npm run build
```

The build will be created in the `build` folder.

## Deployment

This project can be deployed on various platforms:

### GitHub Pages

1. Install the gh-pages package:
   ```
   npm install --save-dev gh-pages
   ```

2. Add the following to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/graphql-profile",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   }
   ```

3. Deploy:
   ```
   npm run deploy
   ```

### Netlify

1. Create a `netlify.toml` file in the project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
     
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy using the Netlify CLI or connect your GitHub repository to Netlify.

## GraphQL Queries

This project uses the following GraphQL queries:

- User information: Gets basic user details
- XP transactions: Retrieves all XP earned by the user
- Projects progress: Gets the user's progress on projects
- Project results: Gets the results of completed projects

## Authentication

The application uses JWT-based authentication. The token is obtained by sending a POST request to the authentication endpoint with Basic authentication credentials. The JWT is then stored in local storage and used for all subsequent GraphQL requests.

## Data Visualization

### XP Over Time Graph
- Interactive SVG line chart showing XP accumulation over time
- Tooltips display detailed information on hover
- X-axis shows dates, Y-axis shows XP amounts
- Highlights user's progression through the curriculum

### Project Pass/Fail Ratio
- Interactive SVG pie chart showing the ratio of passed vs failed projects
- Click on segments to see detailed project lists
- Animated transitions for better user experience
- Provides insight into overall project performance

## Customization

You can customize the profile page by modifying the following files:
- `src/styles.css`: Change colors, fonts, and layout
- `src/components/Profile.js`: Add or remove profile sections
- `src/components/graphs/`: Add new visualization components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as part of a learning exercise for GraphQL
- SVG visualization techniques inspired by D3.js documentation
- Profile design elements based on modern UI/UX practices