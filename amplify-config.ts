// import { Platform, Linking, AsyncStorage } from 'react-native'
import * as WebBrowser from "expo-web-browser";
// import { url } from 'inspector';

const REGION = "us-east-2";
const IDENTITY_POOL_ID = "us-east-2:0055f021-212e-4a51-b7a4-e8822b5889ac";
// const OAUTH_DOMAIN = "customermasterdev.auth.us-east-2.amazoncognito.com";

const USER_POOL_ID = "us-east-2_WzSebDoJ1";
const CLIENT_ID = "4mdni1linn76d1kvvcjhd92185";
// const CLIENT_SECRET = "1qlqh9c8h8fc6docm752s9ukunfdlqm9sjn3msv69569g5gmtfeu";
// const SIGNIN_CALLBACK = "https://mdmdev.vyaire.com/";
// const SIGNOUT_CALLBACK = "https://mdmdev.vyaire.com/signout";
// const IDENTITY_PROVIDER = "customermmastermdmdev";

console.log({
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: IDENTITY_POOL_ID,

    // REQUIRED - Amazon Cognito Region
    region: REGION,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: CLIENT_ID
});

export default {
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: "us-east-2",

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "us-east-2_WzSebDoJ1",

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: "6cbdd9rrbc7kv0l928bin6hr0k",
        authenticationFlowType: "CUSTOM_AUTH"
        // oauth: {
        //   domain: OAUTH_DOMAIN,
        //   scope: [
        //     'phone',
        //     'email',
        //     'profile',
        //     'openid',
        //     'aws.cognito.signin.user.admin',
        //   ],
        //   urlOpener: Platform.OS === 'web' ? null : urlOpener,
        //   redirectSignIn: __DEV__
        //     ? 'http://localhost:19006/'
        //     : SIGNIN_CALLBACK_URL,
        //   redirectSignOut: __DEV__
        //     ? 'http://localhost:19006/signout'
        //     : SIGNOUT_CALLBACK_URL,
        //   responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
        // },
    }
};
