# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.



---------------------------------------------------------------

Frontend for the easy password manager:
- Server never knows the real password.
- All encryption happens on the frontend side using the web crypto apis.
    - the original password is hashed to sha256 and sent to the server. The server store the sha256 password using bcrypt.
    - the original password is hashed to PBKDF2 and this is used to derive a AES-GCM key for the encryption.
