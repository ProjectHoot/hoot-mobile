# Compiling on Android

To compile this program into an apk on android, you have two options: One option for development, one for normal operation.

## Development

1. Type "yarn" to download the required libraries
2. type "npx expo start" to start expo
3. connect an android device
4. press "a" to load the app onto your android device.

This is just for development because the moment expo stops, you lose access to the application. Not ideal!

## Normal operation

1. Open an account on expo.dev
2. run the command: "eas build -p android --profile preview"
3.
