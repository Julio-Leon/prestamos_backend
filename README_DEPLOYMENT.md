# Prestamos Backend - Netlify Deployment

This backend is configured to deploy as serverless functions on Netlify with MongoDB as the cloud database.

## 🚀 Deployment Steps

### 1. Prerequisites
- Netlify account
- MongoDB Atlas account (for cloud database)
- Git repository

### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://cloud.mongodb.com/
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

### 3. Deploy to Netlify

#### Option A: Connect Git Repository
1. Push this code to a Git repository (GitHub, GitLab, etc.)
2. Go to Netlify dashboard
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

#### Option B: Manual Deploy
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`

### 4. Environment Variables
In your Netlify dashboard, go to Site Settings > Environment Variables and add:
- `MONGO_STRING` or `MONGODB_URI`: Your MongoDB connection string

### 5. Test Deployment
After deployment, your API will be available at:
- Base URL: `https://your-site-name.netlify.app`
- Functions: `https://your-site-name.netlify.app/.netlify/functions/`

## 📡 API Endpoints

### Clients
- `GET /.netlify/functions/clients` - Get all clients
- `POST /.netlify/functions/clients` - Create client
- `GET /.netlify/functions/clients/{cedula}` - Get client by cédula
- `PUT /.netlify/functions/clients/{cedula}` - Update client
- `DELETE /.netlify/functions/clients/{cedula}` - Delete client

### Préstamos
- `GET /.netlify/functions/prestamos` - Get all préstamos
- `POST /.netlify/functions/prestamos` - Create préstamo
- `GET /.netlify/functions/prestamos/{id}` - Get préstamo by ID
- `PUT /.netlify/functions/prestamos/{id}` - Update préstamo
- `DELETE /.netlify/functions/prestamos/{id}` - Delete préstamo

## 🔧 Local Development

### Install Dependencies
```bash
npm install
```

### Install Netlify CLI (if not already installed)
```bash
npm install -g netlify-cli
```

### Run Locally
```bash
# Start Netlify dev server (simulates serverless functions)
netlify dev

# Or use the npm script
npm run dev
```

### Environment Variables for Local Development
Create a `.env` file in the root directory:
```
MONGO_STRING=your_mongodb_connection_string
```

## 📁 Project Structure

```
prestamos_backend/
├── netlify/
│   └── functions/
│       ├── clients.js          # Client CRUD operations
│       ├── prestamos.js        # Préstamo CRUD operations
│       ├── models/
│       │   ├── Client.js       # Client model
│       │   └── Prestamo.js     # Préstamo model
│       └── utils/
│           └── db.js           # Database connection utility
├── dist/
│   └── index.html              # API documentation page
├── netlify.toml                # Netlify configuration
├── package.json
└── README_DEPLOYMENT.md
```

## 🔒 Security Features

- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Input validation and sanitization
- Error handling with appropriate HTTP status codes
- MongoDB connection with proper timeouts

## 📊 Database Schema

### Client Schema
```javascript
{
  cedula: String (required, unique),
  firstName: String (required),
  lastName: String (required),
  department: String (required),
  telephoneNumber: Number,
  celularNumber: Number (required),
  address: {
    number: Number,
    street: String,
    apartment: String,
    county: String,
    state: String,
    zipCode: Number
  },
  recommendedBy: String (required)
}
```

### Préstamo Schema
```javascript
{
  cedula: String (required),
  paymentSchedule: String (required),
  prestamoAmount: Number (required),
  startDate: String (required),
  endDate: String (required),
  totalToPay: Number (required),
  interestEarn: Number (required),
  amountOfPayments: Number (required),
  amountPerPayment: Number (required)
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Function timeout**: Increase function timeout in netlify.toml
2. **Database connection issues**: Check MongoDB Atlas IP whitelist
3. **Environment variables**: Ensure they're set in Netlify dashboard
4. **CORS errors**: Check if origin is allowed in function headers

### Debugging:
- Check Netlify function logs in the dashboard
- Use `netlify dev` for local testing
- Verify environment variables are accessible

## 📈 Performance Optimization

- Database connection caching implemented
- Proper error handling to prevent function crashes
- Mongoose connection with timeout settings
- Efficient queries with proper indexing

## 🔄 Updates and Maintenance

To update the deployment:
1. Make changes to your code
2. Commit and push to your Git repository
3. Netlify will automatically redeploy
4. Or use `netlify deploy --prod` for manual deployment

## 📞 Support

For issues with:
- MongoDB: Check Atlas documentation
- Netlify: Check Netlify documentation
- Functions: Review function logs in Netlify dashboard
