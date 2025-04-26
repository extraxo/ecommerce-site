# QuickEquip E-commerce Project

## Description

An e-commerce web application for selling football kits, boots, and other gear, featuring product customization and an admin panel for product management.

## Features

* Browse products by category (kits, boots, other).
* Detailed information pages for each product.
* Kit customization (size selection, player, badges).
* User shopping cart (uses `localStorage`).
* Order submission form.
* **Admin Panel (`/admin`):**
    * Add new products with image upload (Cloudinary).
    * View all added products.
    * Edit existing products.
    * Delete products.
    * Display the number of times a product has been ordered (`orderCount`).

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Template Engine:** EJS
* **Frontend:** HTML, CSS, Vanilla JavaScript
* **Image Handling:** Cloudinary, Multer
* **Sessions:** express-session
* **Environment Variables:** dotenv

## Prerequisites

* Node.js (includes npm)
* MongoDB (local instance or Atlas account)
* Cloudinary Account

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your_repository_URL>
    cd <directory_name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create `.env` file:**
    * Create a file named `.env` in the project's root directory.
    * Add the following variables with your specific values:

        ```dotenv
        MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
        CLOUDINARY_CLOUD_NAME=your_cloud_name
        CLOUDINARY_API_KEY=your_api_key
        CLOUDINARY_API_SECRET=your_api_secret
        SESSION_SECRET=your_strong_session_secret
        PORT=3000
        ```

4.  **Database Setup:**
    * Ensure your MongoDB server is running and accessible via the `MONGODB_URI`.

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    *(Or `node app.js`/`server.js`)*

2.  Open your web browser and navigate to `http://localhost:3000` (or the port you specified).
