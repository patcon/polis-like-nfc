# Polis IRL NFC voting app

## Development

```
# You'll need two devices. We'll assume one actual device and one emulated.
# This should list your actual device
adb devices

# start any emulators you need
emulator -avd <existing emulator ID>

# this should now list real and emulated, with device IDs
adb devices

# Set up reverse port forwarding from device to workstation.
# This allows devices to access you local websocket dev server.
adb -s <real device id> reverse tcp:1999 tcp:1999
adb -s <emu device id> reverse tcp:1999 tcp:1999

# Open the webserver in one terminal.
npm run start-server

# In another terminal, start the react-native expo dev server.
npm start
# The hit "a" to build android (for both devices)
# You should see each device load the app it has installed

# Each app should say that the websocket connection status is "Open" above to logs.
# Updating the Statement ID should propagate between devices.

# Add an API key of format `pkey_*`.
# Add a convo ID that starts with a digit, then any characters.

# Start listening for NFC scans.

# Flash any NFC-enabled tag (some credit cards word, or door fobs) to test.
```

### Production Build

```
npm run android:prod
```
