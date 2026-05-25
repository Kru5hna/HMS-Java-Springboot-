# 100% Free Deployment Guide: Spring Boot + React + PostgreSQL

If you want to host your application live on the internet without spending any money, you can combine three popular cloud services that offer excellent **free-tier** options. 

Here is the ultimate 100% free production architecture:
1. **Database:** **Neon.tech** or **Supabase** (Free, permanent PostgreSQL hosting)
2. **Backend API:** **Render** or **Koyeb** (Free Spring Boot hosting via Docker)
3. **Frontend UI:** **Vercel** or **Netlify** (Free, fast static file CDN hosting for React)

---

## 📋 Table of Contents
1. [Step 1: Set Up Your Free PostgreSQL Database (Neon.tech)](#step-1-set-up-your-free-postgresql-database-neontech)
2. [Step 2: Deploy the Spring Boot Backend (Render)](#step-2-deploy-the-spring-boot-backend-render)
3. [Step 3: Connect React UI and Deploy (Vercel)](#step-3-connect-react-ui-and-deploy-vercel)
4. [💡 Crucial Limitations of Free Hosting (How to handle them)](#-crucial-limitations-of-free-hosting-how-to-handle-them)

---

## Step 1: Set Up Your Free PostgreSQL Database (Neon.tech)

We will use **Neon.tech** because it provides a serverless PostgreSQL database that never expires (unlike Render's free DB which deletes itself after 90 days).

1. Go to [Neon.tech](https://neon.tech/) and sign up for a free account.
2. Click **Create Project**. Name it `hospital_management` and choose a server region closest to you.
3. Once created, you will see a **Connection String** dashboard. It will look like this:
   ```env
   postgresql://alex:strongpass@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this string! In JDBC format (which Spring Boot needs), this translates to:
   * **Host/URL:** `jdbc:postgresql://ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require`
   * **Username:** `alex`
   * **Password:** `strongpass`

---

## Step 2: Deploy the Spring Boot Backend (Render)

Render allows you to host web services for free. We will use your repository's existing `Dockerfile` to let Render compile and run the backend.

### A. Tweak Your Dockerfile for Free Memory Limits
Your Spring Boot application compiles inside a container. Render's free tier has a **512MB RAM** limit. Building the JAR file using Maven inside a free container might trigger an Out-Of-Memory (OOM) crash.

To avoid this, compile the JAR locally on your machine first, and let Render's Docker run the pre-built JAR.
Check that your `backend/Dockerfile` matches your existing one:
```dockerfile
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### B. Compile the JAR locally
Open your PowerShell or terminal in the `backend` folder and run:
```powershell
.\mvnw.cmd clean package -DskipTests
```
This outputs the compiled file to `backend/target/backend-0.0.1-SNAPSHOT.jar`. Make sure to commit the `target` folder or remove it from `.gitignore` so Render can access it.

### C. Deploy on Render
1. Push your full repository to a public or private GitHub repository.
2. Go to [Render.com](https://render.com/) and log in.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. In the Creation Form, configure:
   * **Name:** `hospital-backend`
   * **Language:** `Docker`
   * **Region:** Same region as your Neon database (to keep requests fast).
   * **Instance Type:** **Free** ($0/month).
6. Click **Advanced** and add the following **Environment Variables**:
   * `SPRING_PROFILES_ACTIVE` = `prod`
   * `SERVER_PORT` = `10000` *(Render maps its public port automatically)*
   * `DB_URL` = `jdbc:postgresql://ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require` *(Replace with your Neon JDBC URL)*
   * `DB_USERNAME` = `alex` *(Replace with your Neon Username)*
   * `DB_PASSWORD` = `strongpass` *(Replace with your Neon Password)*
   * `CORS_ALLOWED_ORIGINS` = `https://your-frontend-vercel-domain.vercel.app` *(You will get this domain in Step 3)*
7. Click **Create Web Service**. 
8. Render will pull your repository, find the Dockerfile, and boot the Spring Boot server. Copy the generated URL (e.g., `https://hospital-backend.onrender.com`).

---

## Step 3: Connect React UI and Deploy (Vercel)

Vercel is the industry gold standard for hosting React frontends for free. It is fast, has zero cold starts, and deploys automatically on every git commit.

### A. Point your React code to Render
Currently, your React application uses simulated mock states. When you write your HTTP/Fetch requests, you should configure your API base URL to load from Vercel's environment variables.

In your React code, configure your base endpoint like this:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### B. Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your project's GitHub repository.
4. In the configuration window:
   * **Framework Preset:** Vite
   * **Root Directory:** Edit this and set it to `frontend` (since your React app is located in the `/frontend` subfolder).
5. Open **Environment Variables** and add:
   * `VITE_API_BASE_URL` = `https://hospital-backend.onrender.com/api` *(Your live Render backend URL from Step 2)*
6. Click **Deploy**.
7. Vercel will build your static React code in seconds and give you a free, secure URL (e.g., `https://hospital-management-react.vercel.app`).
8. **Crucial:** Go back to Render.com and update your backend's `CORS_ALLOWED_ORIGINS` environment variable to match this new Vercel domain! This is required so your backend doesn't block requests from your frontend.

---

## 💡 Crucial Limitations of Free Hosting (How to handle them)

Because you are using $0 services, there are two major behaviors to expect:

### 1. The "Cold Start" Sleep (Render)
To save energy, Render's **Free Web Services** automatically spin down ("go to sleep") if they don't receive any traffic for 15 minutes.
* **What happens:** When the first user opens your app after a break, the frontend will load instantly (via Vercel), but any database requests or patient lists will be stuck loading for **50 to 90 seconds** while Render wakes up the Spring Boot container.
* **How to fix/workaround:**
  * **Add a Loading Spinner:** Ensure your frontend UI displays a nice loading animation when fetching data so users know the app is waking up, rather than thinking it is broken.
  * **Keep-Alive Script:** You can set up a free uptime monitor (like [UptimeRobot](https://uptimerobot.com/)) to send an HTTP ping to your backend's `/actuator/health` endpoint once every 14 minutes. This keeps the container awake so you never experience cold starts during active testing hours!

### 2. Neon Active Hours
Neon free-tier databases never delete your data, but if a database receives no queries for 84 consecutive hours, it enters an active state pause. As soon as you make a request (e.g. by logging into the dashboard or trying to query the API), it automatically resumes active status within 2-3 seconds.
