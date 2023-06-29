Android & iOS app for the support of volunteer fire brigades by measuring in real time the time it takes to initiate a potential emergency rescue.

### Setup environment variables

Create .env file in the main folder based on .env.example file

### Create Firebase Project

Go to the [Firebase Console](https://console.firebase.google.com/) and create yout own project.

### Setup Firebase Authentication

Add Firebase Authentication feature to your project.

```
# Generate SHA certificate fingerprint
keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore
```

1. Copy the SHA-1
2. Enter it in project of firebase console then
3. Download the `google-services.json` file and save it in the main folder
4. Run `npm run rebuild`

### Setup EAS Secrets

```
# Importing environment variables from a .env file
eas secret:push --scope project --env-file ./.env --force

# Upload google-services.json to EAS
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --force

# To view any existing secrets for this project, run
eas secret:list
```

More info: https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables
