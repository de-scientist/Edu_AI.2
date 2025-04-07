# Start both frontend and backend servers
Write-Host "Starting Edu_AI servers..." -ForegroundColor Green

# Start the backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Start the frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Servers started! Access the application at http://localhost:3001" -ForegroundColor Green 