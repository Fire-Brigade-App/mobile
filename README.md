Android & iOS app for the support of volunteer fire brigades by measuring in real time the time it takes to initiate a potential emergency rescue.

### Setup environment variables
```
# Create .env file in the main folder based on .env.example file

# Importing secrets from a .env file
eas secret:push --scope project --env-file ./.env

# Upload google-services.json to EAS
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --force

# To view any existing secrets for this project, run
eas secret:list
```
More info: https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables