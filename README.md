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

## Usage

1. Gather NFC tags (key fobs or some credit cards work fine) and 3 phones.
1. Create a Polis conversation. Note the conversation ID in URL.
1. Add at minimum one statement and vote on that statement. (this allows access to report)
1. Create a report (you'll use this later to see complete list of statements).
1. Install production app on 3 phones
1. Enter the conversation ID in each of the 3 apps.
1. Set each phone a different vote type, and initiate NFC scanning.
1. Leave "Agree" and "Disagree" phones face down.
1. Open the report, and scroll to the bottom to see the full list of statements, including each numeric "statement ID".
1. On the "Unsure" device, set the active Statement ID (it will sync to the other devices).
1. Read out each statement, enter the statement ID in the app (from the report), and ask people to scan their NFC tag at the appropriate device.
1. If there Polis conversation page is up on a screen, it will update in real-time.
