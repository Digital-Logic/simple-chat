# Express with HMR template

## What it provides
* Express with HMR
* MongoDB, Mongoose
* Testing with Mocha, Chai in watch mode

### Available commands
```javascript
npm run start // Start the development server with HMR
npm run build // Create a deployment build, (/build)
npm run test  // Run tests through Mocha / Chai (with watch mode enabled)
npm run clean // Remove build files
```

### Customize
.env.defaults: is provided with some common defaults, override these settings with your own in a .env file.

Create a .env.testing file to set specific settings to use during testings.