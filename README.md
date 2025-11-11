This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

CONTEXT : VISUAL ANALYSER FULL-STACK PROJECT

This is the complete technical context for building the Next.js Frontend.

**GOAL:** Build a functional Next.js application (Frontend) that interfaces with a complete NestJS API (Backend) to visualize geotagged photos on a map, allow user authentication, photo uploads, and commenting.

---

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
