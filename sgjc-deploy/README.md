# Sri Gayathri Junior College Portal

A comprehensive portal built with Python (Flask) and SQLite for managing staff, students, fees, attendance, timetable, and more.

## Architecture

* **Backend**: Python 3.11 with Flask providing a RESTful JSON API.
* **Database**: SQLite (Auto-generated on first run).
* **Frontend**: Vanilla HTML/JS/CSS calling the Flask APIs via \etch\.

## Setup Instructions for Local Development

1. **Install Python**: Ensure you have Python 3.11+ installed.
2. **Install Dependencies**:
   \\\ash
   pip install -r requirements.txt
   \\\
3. **Run the Application**:
   \\\ash
   python app.py
   \\\
   The server will start at \http://127.0.0.1:5000\. The SQLite database and uploads folder will be automatically created on the first run.

## Deployment to Render

This project includes a \ender.yaml\ Blueprint configuration to make deployment to Render extremely simple.

1. Push this repository to GitHub.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New > Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read the \ender.yaml\ file and provision a Web Service with a Persistent Disk.
   * *Note: The persistent disk ensures your SQLite database and file uploads are saved permanently. This requires a paid Starter plan (/mo) on Render.*

**If deploying on the Free Tier**:
Render's free tier does NOT support persistent disks. If you deploy on the free tier, you will lose your database and uploaded files every time the server restarts or deploys. If you want a free tier deployment, delete the \disk\ section from \ender.yaml\ before deploying.

## Important Note regarding Razorpay
The application is currently configured with **Test** API keys for the Razorpay payment gateway. Before going live in production, you must edit \pp.py\ and replace the test keys with your live production keys.
