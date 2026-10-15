# PocketNotes

PocketNotes is a lightweight notes app built with Expo and React Native. Notes are stored on the device in a local SQLite database, so they remain available after the app is closed.

## Download the Android APK

Open the [PocketNotes EAS build page](https://expo.dev/accounts/kaustubh-colt/projects/PocketNotes/builds/540a8975-c8c6-43da-9f91-5003a1f0b4aa) on your Android device and choose **Install**, or scan the QR code below:

```text
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █ ▄▄▄▄▄ █▄▀▀▀ ▄██▀▀▀▄█▀▀ █▀▀█ █ ▄▄▄▄▄ █
  █ █   █ █   █▀ ▄▀▄▀ ▀▄█▀██ ▀▀▀█ █   █ █
  █ █▄▄▄█ █▄█▀█  █▄ ▄   ▀▀▄  ▄▄ █ █▄▄▄█ █
  █▄▄▄▄▄▄▄█▄█ ▀▄█▄█ ▀▄▀ █ █ █ █ █▄▄▄▄▄▄▄█
  █▄▄▄ ▀▀▄█▄▀ ▀██▄█ ▄█  ▄█ ▀▀██▀▄█▀▄  ▀▄█
  █  ▀█  ▄  █▄▄▀ █▀ ▄█▀ ▄█ ▄▀▀▀  ▀ ▄█  ▀█
  █▀█ ▀█▀▄▄▀▀▄██ █ ▄ █▀██▄█▀▄     ▀   █ █
  █▀▄▄▄ █▄ ▀█▀▀▀▄▀▀ ██▄▀▀▀███▀▀▀▀█▀  █▄▀█
  ██ ▀▄▀ ▄ ▄█▄ ▀  ▀ ▀▀▄ ▄▄  ▄█▀▄█▀▀█▀▄ ▀█
  █▄   ▄ ▄▀ ▀█▀▄██▄ ▀▄█ ▄▄██▄▄▄▄▄▀▀ ▀▄ ▄█
  ██▀▄███▄▄█ █▀ ▀█▄▄ █▀▀██▀█▀▄█  █▀▄██ ██
  █ █▄▄ ▀▄ ▄▄  ▀▀▀▀█▄▀▀▀▄ ▄ ▀█▀ ▀█▄▄ ▀███
  ██▄█▀▀▀▄ ▄█ █ ▄█ ▄  ▀▄▀▄█ ▄▄▀▀  ▀ █ ▄ █
  █▀▄ ▀▀▀▄▀ █▀█ ▄ ██▄▄ █ ▀▀▀▄▄█▀▄▄ ██▄▄▀█
  ███▄▄▄█▄▄ ▄▄ ▄  ▀██▀█ ▄▄▀▀▄▄▄ ▄▄▄ ▄ ▄ █
  █ ▄▄▄▄▄ ██▀█▀██▀▄█▀▀▀▄▄▄█▀▄▄█ █▄█  █ ▄█
  █ █   █ █▀▀▀▀██▀▄█ ▀▀█ █ ██ █   ▄ █▀█▄█
  █ █▄▄▄█ █ ██ ▄▀▄▀ ▄ ███▄ █▀▄▀█▀▄  ▄ ███
  █▄▄▄▄▄▄▄█▄▄███▄█▄█▄██▄█▄██▄▄███▄▄▄▄▄▄▄█
```

## Features

- Create, edit, and delete notes
- Search note titles and content
- Store notes locally with SQLite
- Android, iOS, and web development targets

## Tech stack

- Expo SDK 57
- React Native 0.86 and React 19
- TypeScript
- Expo Router
- Expo SQLite

## Project layout

- `src/app/index.tsx` - PocketNotes screen and note interactions
- `database/database.ts` - SQLite initialization and note operations
- `assets/` - app icons and splash artwork
- `app.json` - Expo app configuration
- `eas.json` - EAS Build profiles, including the Android APK preview profile

## Run locally

Install dependencies and start the Expo development server:

```sh
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on an Android emulator, iOS simulator, or a compatible device. The `web` script starts the web target.

## Build and download the Android APK

The `preview` profile in `eas.json` is configured for internal distribution and produces an installable Android APK. Sign in to Expo if prompted, then run this from the project directory:

```sh
npx eas-cli@latest build --platform android --profile preview
```

When the build completes, the EAS CLI prints the build page URL in the terminal. Open the page and choose **Install** to see the APK install link and QR code for opening it on a device.

## Quality checks

```sh
npm run lint
npx tsc --noEmit
npx expo-doctor
```
