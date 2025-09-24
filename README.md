# PantryPal

Welcome to PantryPal, a web application that helps you find recipes based on the ingredients you have on hand.

## Features

- **Ingredient-based Recipe Search:** Enter your ingredients and get a list of matching recipes.
- **Visual Ingredient Recognition:** Upload a photo of your ingredients and let our AI identify them for you.
- **AI ChefBot Assistant:** Get help with recipes, ask for substitutions, and get cooking tips from our AI-powered ChefBot.
- **Favorite Recipes:** Save your favorite recipes for easy access later.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd pantry-pal
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

This project uses the Spoonacular API to fetch recipe data. You'll need to get a free API key to run the application.

1.  Sign up for a free API key at [spoonacular.com/food-api](https://spoonacular.com/food-api).
2.  Create a new file named `.env.local` in the root of the project.
3.  Add your API key to the `.env.local` file:

    ```
    SPOONACULAR_API_KEY=YOUR_SPOONACULAR_API_KEY_HERE
    ```

### Running the Development Server

Once you have set up your environment variables, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
