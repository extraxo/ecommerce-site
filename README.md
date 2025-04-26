# QuickEquip E-commerce Project

## Description

This is an e-commerce web application designed for selling football equipment, including kits, boots, and other accessories. The application features product customization (for kits) and an administration panel for managing products and orders.

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
* **Image Handling:** Cloudinary (storage), Multer (file uploads)
* **Sessions:** express-session
* **Environment Variables:** dotenv

## Prerequisites

Before you begin, ensure you have installed:

* [Node.js](https://nodejs.org/) (includes npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (installed locally or an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
* An account on [Cloudinary](https://cloudinary.com/)

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
    *(Or `yarn install` if you use Yarn)*

3.  **Create `.env` file:**
    * Create a file named `.env` in the project's root directory.
    * Copy the contents of `.env.example` (if you have one) or add the following variables with their respective values:

        ```dotenv
        # MongoDB Connection String
        MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
        # Or your local URI: mongodb://localhost:27017/quickequip

        # Cloudinary Credentials
        CLOUDINARY_CLOUD_NAME=your_cloud_name
        CLOUDINARY_API_KEY=your_api_key
        CLOUDINARY_API_SECRET=your_api_secret

        # Session Secret (you can generate a random string)
        SESSION_SECRET=d1c2f9ea5a6b4b0f0c57a3e8aa9e24c2232e8e2846d1a73347b6f7c351adbd91

        # Port (optional, defaults to 3000 or specified in your code)
        PORT=3000
        ```
    * **Note:** Replace the placeholder values with your actual MongoDB and Cloudinary credentials. **Never commit the `.env` file to a public repository!** Add it to your `.gitignore` file.

4.  **Database Setup:**
    * Ensure your MongoDB server is running (locally or on Atlas).
    * The application should create the necessary collections automatically on first use if using Mongoose.

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    *(Or `node app.js`, `node server.js` depending on your main file name)*

2.  **If using `nodemon` for development:**
    ```bash
    npm run dev
    ```
    *(Assuming you have a "dev" script configured in your `package.json`)*

3.  Open your web browser and navigate to `http://localhost:<PORT>` (e.g., `http://localhost:3000`).

## Usage (Optional)

* Navigate to `/` for the welcome page.
* Navigate to `/home` to browse products.
* Navigate to `/admin` to access the administration panel.

