# sko-frontend
This is the frontend code for the sikobaPay platform.

Start the mobile application on Android:

```
$ npm start
$ adb reverse tcp:5000 tcp:5000
```

The last command is needed for the application in the emulator to be able to
connect to the development server.

If you are using an Android emulator, you need to start it before running this
command. See below.

Or, start the mobile application on iOS:

```
$ cd ios
$ npm start
```

## Android emulator

The easiest way to start the Android emulator is through Android Studio. Open
the project at `SikobaApp/android`. Go to `Tools -> AVD Manager` and create or
select an existing virtual device and start it up.

Once the virtual device is created, it can be started from the command line. Run
`$ANDROID_HOME/emulator/emulator -avd YOUR_AVD_DEVICE_NAME`, where
`ANDROID_HOME` is the root directory for the Android SDK
(`/usr/local/share/android-sdk` if using Homebrew). You can list the AVD device
names with `$ANDROID_HOME/emulator/emulator -list-avds`.

=======
