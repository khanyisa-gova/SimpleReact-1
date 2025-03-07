# SimpleReact Application Troubleshooting Guide

This guide provides step-by-step instructions for running the SimpleReact application locally and troubleshooting common issues, particularly with authentication.

## Running the Application Locally

### 1. Start the Backend Server

Always start the backend server first:

```bash
cd SimpleReact/Backend/SimpleReact.API
dotnet run --urls="http://localhost:5000"
```

You should see output indicating that the server is running, including:
- Database initialization
- CORS policy configuration
- Application listening on http://localhost:5000

### 2. Start the Frontend Server

In a separate terminal, start the frontend server:

```bash
cd SimpleReact/Frontend/simple-react-app
npm run dev
```

The frontend server should start and display a URL (typically http://localhost:5173).

### 3. Access the Application

Open your browser and navigate to http://localhost:5173

### 4. Login with Admin Credentials

Use the following credentials to log in:
- Username: `admin`
- Password: `Admin123!`

## Troubleshooting Authentication Issues

If you encounter login problems, follow these steps to diagnose and resolve the issue:

### 1. Check Environment Variables

Ensure the frontend has the correct API URL:

1. Verify the `.env` file exists in the `Frontend/simple-react-app` directory
2. Confirm it contains: `VITE_API_URL=http://localhost:5000`
3. Restart the frontend server after any changes to environment variables

### 2. Check Browser Console for Errors

1. Open browser developer tools (F12 or right-click → Inspect)
2. Go to the Console tab
3. Look for any error messages, particularly:
   - Network errors (CORS, connection refused)
   - API response errors
   - JavaScript errors

### 3. Verify Backend Logs

Check the terminal running the backend server for:
- Login attempt logs
- Password validation results
- Any exceptions or errors

### 4. Check CORS Configuration

If you see CORS errors in the browser console:
1. Verify the backend CORS configuration in `Program.cs`
2. Ensure it allows requests from your frontend origin
3. Check that the frontend is making requests to the correct backend URL

### 5. Verify Database Connectivity

1. Check if the SQLite database file exists at `Backend/SimpleReact.API/SimpleReact.db`
2. Ensure the application has read/write permissions to the database file
3. Verify the connection string in `appsettings.json`

### 6. Test API Endpoints Directly

Use a tool like curl or Postman to test the authentication endpoint directly:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

You should receive a JWT token in the response.

## Common Issues and Solutions

### "An error occurred during login. Please try again."

This generic error message can be caused by:

1. **Backend not running**: Ensure the backend server is running on http://localhost:5000
2. **Incorrect API URL**: Check the VITE_API_URL in the .env file
3. **CORS issues**: Verify CORS configuration allows requests from the frontend
4. **Invalid credentials**: Double-check username and password
5. **Database issues**: Ensure the database exists and contains the admin user

### Network Error: Failed to fetch

1. Verify the backend server is running
2. Check that the API URL is correct in the .env file
3. Ensure there are no firewall or network issues blocking the connection

### CORS Error: Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy

1. Verify the CORS configuration in Program.cs allows requests from http://localhost:5173
2. Restart the backend server after any changes to CORS configuration

## Additional Debugging Tips

1. **Clear browser cache and cookies**: Sometimes cached data can cause authentication issues
2. **Try a different browser**: This can help identify browser-specific issues
3. **Check for network issues**: Ensure localhost connections are not being blocked
4. **Verify JWT token configuration**: Check the JWT settings in appsettings.json
5. **Enable more detailed logging**: Increase the logging level in appsettings.json for more detailed backend logs

If you continue to experience issues after following these steps, please provide the specific error messages from both the browser console and backend logs for further assistance.
