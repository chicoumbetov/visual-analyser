# 🗺️ Visual Analyzer: Geotagged Photo Visualization

This project is built as a technical interview exercise to demonstrate full-stack development skills, focusing on authentication, media handling, geospatial data visualization, and microservice integration.

## 🚀 Project Goal (The Exercise)

The goal is to build a web application allowing users to sign up/log in, upload geotagged photos, and display those photos as markers on an interactive map. Users must be able to click a marker to view the image and add comments.

## 🛠️ Technology Stack

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (App Router)** + **TypeScript** | Modern React framework for performant client-side rendering and static data fetching, leveraging strong typing. |
| **Styling/UI** | **Tailwind CSS** + **Shadcn/ui** | Rapid, utility-first styling for a professional, responsive design. Shadcn provides pre-built, accessible components. |
| **State/Data** | **React Query** (TanStack Query) + **React Context** | Manages server state (API fetching/caching) and client-side auth state efficiently. |
| **Backend/API** | **NestJS** + **TypeScript** | Scalable, modular framework built on Node.js/Express (monorepo structure). |
| **Database** | **PostgreSQL** + **Prisma ORM** | Reliable, feature-rich relational database with type-safe queries. |
| **Authentication** | **JWT (Access/Refresh Tokens)** | Secure authentication using HTTP-only refresh tokens. |
| **Storage** | **Supabase Storage (S3-compatible)** | Cloud-based, scalable object storage for binary files (photos). |
| **Map Visualization** | **MapLibre GL JS** | Open-source, fast, and feature-rich library for displaying vector tiles and custom markers. |

## 🏗️ System Architecture & Data Flow

### 1. Core Services

* **Auth Service:** Handles user registration, login, token issuance, and validation.
* **User Service:** Manages user profile retrieval.
* **Photo Service:** Manages photo uploads, geospatial data extraction, and storing photo metadata (URL, Lat/Lng).
* **Comment Service:** Manages comments linked to photos.

### 2. Image Upload and Display Flow (Map Integration)

1.  **User Action:** User selects a photo on the Dashboard.
2.  **Geospatial Extraction:** The Frontend reads the **GPS data (Lat/Lng)** from the EXIF metadata of the image file.
3.  **File Upload:** The raw image file is uploaded directly to **Supabase Storage**. Supabase returns a public access URL.
4.  **Metadata Save:** Frontend sends the **Supabase URL**, **extracted Lat/Lng**, and the **User ID** to the NestJS Photo API (`POST /photos`).
5.  **Map Display:** The Dashboard fetches the list of photos (`GET /photos`) and uses the Lat/Lng coordinates to place **markers** on the map via MapLibre GL JS.

## 🚀 BACKEND API SPECIFICATION (NestJS)

The API is deployed and running on a base URL (e.g., `process.env.NEXT_PUBLIC_API_URL`).

### 1. Authentication & User Endpoints

| Endpoint | Method | Status | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Public | Logs user in. | `IAuthForm` (email, password) | `IAuthResponse` |
| `/auth/register` | `POST` | Public | Registers new user. | `IAuthForm` (name, email, password) | `IAuthResponse` |
| `/auth/logout` | `POST` | Public | Clears refresh token cookie. | None | `boolean` (true on success) |
| `/auth/login/access-token` | `POST` | Refresh | Issues new tokens using the Refresh Token cookie. | None | `IAuthResponse` |
| `/users/profile` | `GET` | Protected | Fetches the current authenticated user's profile. | None | `IUser` |

**Authentication Mechanism:** Access Tokens are used in the `Authorization: Bearer <token>` header for all protected endpoints. Refresh Tokens are managed via secure, HTTP-only cookies.

### 2. Photo Endpoints (Core Feature)

| Endpoint | Method | Status | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/photos` | `POST` | Protected | **Uploads a new photo.** Requires `multipart/form-data` with field `image` (file) and JSON metadata. | `{title: string, latitude: number, longitude: number}` | `IPhoto` |
| `/photos` | `GET` | Public | Fetches all photos to display markers on the map. | None | `IPhotoRdo[]` |
| `/photos/:id` | `GET` | Public | Fetches a single photo and its comments. | None | `IPhotoDetails` |

### 3. Comment Endpoints

| Endpoint | Method | Status | Description | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/photos/:photoId/comments`| `POST` | Protected | Creates a new comment on a specific photo. | `{text: string}` | `ICommentRdo` |
| `/photos/:photoId/comments`| `GET` | Public | Fetches all comments for a specific photo. | None | `ICommentRdo[]` |

## 💻 Getting Started (Local Development)

### Prerequisites

* Node.js (v20+)
* Docker (for local PostgreSQL instance)
* Prisma CLI

### Installation

```bash
# Clone the repository (Assuming monorepo structure: visual-analyser and visual-analyser-api)
git clone [YOUR_REPO_URL]
cd visual-analyser

# Frontend setup
npm install
cd ../visual-analyser-api

# Backend setup
npm install
npx prisma generate
