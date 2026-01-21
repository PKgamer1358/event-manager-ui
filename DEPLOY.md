# Deployment Guide for Event Manager UI (Vercel)

This UI is a React application configured for deployment on [Vercel](https://vercel.com/).

## Prerequisites

1.  **GitHub Repository**: Ensure this UI code is pushed to a GitHub repository (separate from the API).
2.  **Deployed API**: You must have the API deployed (e.g., on Render) to get its URL.

## Deployment Steps

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2.  **Import Project**:
    *   Click "Add New..." -> "Project".
    *   Import your `event-manager-ui` repository.
3.  **Configure Project**:
    *   **Framework Preset**: It should automatically detect "Create React App".
    *   **Root Directory**: If your package.json is in the root, leave this blank.
    *   **Build & Output Settings**: Default build command (`npm run build`) and output directory (`build`) are usually correct.
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add the following variable:
        *   **Key**: `REACT_APP_API_BASE_URL`
        *   **Value**: Your deployed API URL (e.g., `https://event-manager-api.onrender.com`).
          > **Note**: Do not add a trailing slash `/` to the URL.
5.  **Deploy**: Click "Deploy".

## SPA Routing

I have added a `vercel.json` file to ensure that reloading the page works correctly (Single Page Application routing). Vercel should pick this up automatically.
