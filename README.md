# BeCrazy Frontend

BeCrazy is a social media application where people can post videos of themselves doing challenges. This repository contains the code for a mobile application built with [Expo](https://expo.io/) and [TypeScript](https://www.typescriptlang.org/).

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [License](#license)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Expo](https://expo.io/)
- [Expo CLI](https://docs.expo.io/workflow/expo-cli/)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repo

```sh
git clone
```

2. Install NPM packages

```sh
npm install
```

3. Run the app

```sh
npx expo start
```

## Project Structure
The code for the BeCrazy application is organized into several folders:

- `assets`: This folder contains static assets, such as images and fonts, that are used in the app.
- `components`: This folder contains reusable React components that are used throughout the app.
- `constants`: This folder contains constants that are used throughout the app, such as colors and API URLs.
- `helpers`: This folder contains helper functions that are used throughout the app, such as functions for validating user input.
- `hooks`: This folder contains custom React hooks that are used throughout the app.
- `interfaces`: This folder contains TypeScript interfaces that are used throughout the app. For example, the `User` interface is used to define the shape of a user object. `interfaces` is a good place to store interfaces that are used in multiple places throughout the app.
- `navigation`: This folder contains the code for the app's navigation stack, which defines how users move between screens.
- `screens`: This folder contains the code for each of the app's screens, or "views". Each screen is a React component that defines the UI for a particular part of the app.

## License

Distributed under the MIT License. See `LICENSE` for more information.


