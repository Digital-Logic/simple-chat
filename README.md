# Express Template with HMR template

## What it provides
* User authorization, authentication, and access control.
* Control access on a per route and per field.
* JWT token support built in
* Bcrypt encryption on user passwords
* Email validate, password reset using jwt tokens.
* Express with HMR support through webpack.
* MongoDB, Mongoose.
* Testing with Mocha, Chai in watch mode.
* Logging with winston and morgan.
* Global error handling.
* Pug template generation / bundling through webpack.

### Task List
- [ ] Jwt secret rotation.
- [ ] API endpoint brute force protection.
- [ ] Google, facebook login support.
- [ ] controller and route generators.

### Available commands
```javascript
npm run start // Start the development server with HMR
npm run build // Create a production build, (/build)
npm run test  // Run tests through Mocha / Chai (with watch mode enabled)
npm run clean // Remove build files
```

### Env Variables
Common env variables are injected into the built bundle, unless overrides are provided.
All other are expected to be injected on runtime.

Development envs are injected through the .env file.
.env.defaults: is provided with some common defaults, override these settings with your own in a .env, and .env.testing file.

.env.testing file to set specific settings to use during testing.