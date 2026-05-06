# Food Delivery App

A responsive food ordering web application built with React, Vite, and Tailwind CSS. This project is designed to simulate a modern food delivery platform where users can browse restaurant items, search for dishes or restaurant names, open menu pages, add products to a cart, and manage their order selection through a simple and interactive interface.

The app focuses on frontend functionality and user experience while also demonstrating practical React concepts such as routing, lazy loading, reusable components, context-based state management, API integration, local fallback data handling, and persistent cart storage with `localStorage`.

## Project Overview

This application presents a food delivery experience inspired by real-world ordering platforms. Users can explore available food items, filter restaurants based on rating, search with suggestion support, and navigate to a restaurant menu screen to view related items. From there, they can add dishes to the cart, update quantities, remove items, and continue exploring the app.

The project also includes a mock API workflow using `json-server`. When the local API is available, the app fetches restaurant data from it. If the API is unavailable, the application falls back to locally stored restaurant data, making the project more reliable and easier to run during development.

## Features

- Responsive restaurant listing interface
- Search bar with live suggestion dropdown
- Restaurant filtering based on rating
- Dedicated restaurant menu page using dynamic routes
- Add-to-cart functionality with toast notifications
- Cart state management using React Context API
- Cart persistence through `localStorage`
- Lazy-loaded routes for better performance
- Mock API support with fallback local data
- Reusable component-based architecture

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- JSON Server
- ESLint

## Folder Structure

```bash
src/
  components/
    pages/
      Cart.jsx
      Checkout.jsx
      Help.jsx
      Offers.jsx
      SignIn.jsx
    ApiCalling.jsx
    Body.jsx
    Footer.jsx
    Header.jsx
    RestaurantMenu.jsx
    ToastContext.jsx
  context/
    CartContext.jsx
  data/
    restaurants.js
  utils/
    restaurantData.js
  App.jsx
  main.jsx

mock/
  db.json
```

## Main Functionality

### Home Page

The home page displays restaurant or dish cards in a grid layout. Users can browse the available options and use the filter buttons to narrow results, such as showing only highly rated items.

### Search with Suggestions

The header contains a search input that supports live suggestions. Suggestions are generated from cached restaurant data and allow users to quickly find matching restaurants or locations. Selecting a suggestion can also navigate the user directly to a restaurant menu page.

### Restaurant Menu Page

Each restaurant route displays related menu items based on the selected restaurant or location. This page also allows users to add items directly to the cart.

### Cart Management

The cart page lets users:

- View selected items
- Increase or decrease quantity
- Remove individual items
- Clear the entire cart
- View subtotal calculation

Cart data is stored in `localStorage`, so refreshing the page does not remove the selected items.

### Toast Notifications

The app uses a toast system to provide quick visual feedback when users add or remove items from the cart.

## Data Handling

Restaurant data is managed through `src/utils/restaurantData.js`.

The application first tries to fetch data from:

```bash
http://localhost:3001/restaurants
```

If the mock API is not running or fails to respond, the app automatically falls back to local data from:

```bash
src/data/restaurants.js
```

This makes the application easier to test and demo without depending fully on a backend service.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock API server

```bash
npm run mock
```

This starts `json-server` on port `3001`.

### 3. Start the development server

```bash
npm run dev
```

After starting the app, open the local development URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run mock
npm run build
npm run lint
npm run preview
```

## Current Pages

- `/` - Home page
- `/restaurant/:id` - Restaurant menu page
- `/cart` - Cart page
- `/checkout` - Checkout page
- `/signin` - Sign in page
- `/offers` - Offers page
- `/help` - Help page

## Learning Highlights

This project is useful for practicing and demonstrating:

- React component structure
- State and effect handling
- Context API for global state
- Routing with React Router
- Lazy loading with `React.lazy` and `Suspense`
- API fetching with Axios
- Fallback data strategies
- Persistent browser storage
- Responsive UI development with Tailwind CSS

## Current Limitations

- Some pages such as Checkout, Offers, Help, and Sign In are currently basic placeholder pages
- The project still has some lint issues that can be improved later
- A real backend, payment flow, and authentication system are not yet implemented

## Future Improvements

- Add real user authentication
- Build a complete checkout flow
- Connect to a real backend or database
- Add category filters and sorting options
- Add order history and user profile features
- Improve accessibility and mobile navigation
- Add unit and integration tests

## Conclusion

This Food Delivery App is a strong frontend practice project that combines UI design, routing, state management, API handling, and cart functionality in one application. It is a good example of building a realistic React project with reusable components and practical features commonly found in modern web applications.
