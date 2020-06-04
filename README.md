# EasyChords

## Prerequisites for standalone use (web-client only)
- Node / NPM

## Prerequisites for use with external midi
- Node / NPM
- Kotlin and Java
- Gradle
- Midi receiver device
    - On Windows consider using e.g. [loopMIDI](https://www.tobias-erichsen.de/software/loopmidi.html)
    - On macOS see this [article](https://medium.com/@keybaudio/virtual-midi-devices-on-macos-a45cdbdffdaf)
- Some software which can input midi

## web-client

React web application. Run `npm install` to install the dependencies.

### Available Scripts

In the sub-project directory, you can run:

#### `npm start`

Runs the app in the development mode on [http://localhost:3000](http://localhost:3000)

#### `npm run build`

Builds the app for production to the `build` folder.<br />

#### `npm run storybook`

Runs the storybook on [http://localhost:9009](http://localhost:9009)

## midi-server

Spring Boot application which works as a connector between frontend and midi receivers.

### Gradle tasks

`bootRun`

Starts the server on [http://localhost:8080](http://localhost:8080)


`bootJar`

Builds a distributable jar file
