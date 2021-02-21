import * as types from "../types";
import { removeLeadingSlash, btoa } from "../utils";
import axios from "axios";
import { StorageFactory } from "../types";
export class Credentials implements types.CredentialsInterface {
    private readonly expires: number;
    clientKey: string;
    consumerId: string;
    accessToken: string;
    refreshToken: string;
    phoneNumber: number;
    isNewUser: boolean;

    constructor(
        clientKey: string,
        consumerId: string,
        accessToken: string,
        refreshToken: string,
        phoneNumber: string,
        isNewUser: boolean,
        expires?: number
    ) {
        this.clientKey = "SpitfireMerch";
        this.consumerId = consumerId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.phoneNumber = parseInt(phoneNumber);

        this.expires = expires || Math.floor(Date.now() / 1000) + 1800;
        this.isNewUser = isNewUser;
    }

    get isExpired() {
        return Math.floor(Date.now() / 1000) >= this.expires;
    }

    toString() {
        return JSON.stringify({
            consumerId: this.consumerId,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            phoneNumber: this.phoneNumber,
            isNewUser: this.isNewUser,
            expires: this.expires
        });
    }

    static FromJSON(jsonCreds: any) {
        return new Credentials(
            jsonCreds.clientKey,
            jsonCreds.consumerId,
            jsonCreds.accessToken,
            jsonCreds.refreshToken,
            jsonCreds.phoneNumber,
            jsonCreds.isNewUser,
            jsonCreds.expires
        );
    }
}

export default class Request {
    private clientKey: string;
    private clientSecret: string;
    private storage: StorageFactory;
    private options: types.Options;

    constructor(options: {
        headers: {};
        protocol?: string;
        clientKey: string;
        fetch?: any;
        host?: string;
        clientSecret: string;
        storage: StorageFactory;
        version?: string;
    }) {
        const {
            clientKey = "SpitfireMerch",
            clientSecret = "hU4Js2Uzn2QZh&THx5Ye^Ypfz7UP%8M!",
            storage,
            ...others
        } = options;

        this.clientKey = clientKey;
        this.clientSecret = clientSecret;
        this.storage = storage;

        this.options = {
            host: options.host
                ? options.host
                : "fidcv69bxg.execute-api.us-east-2.amazonaws.com/dev",
            protocol: options.protocol ? options.protocol : "https",
            version: options.version ? options.version : "v2",
            headers: options.headers ? options.headers : {}
        };
    }

    async request(
        method:
            | "POST"
            | "GET"
            | "DELETE"
            | "PUT"
            | "options"
            | "get"
            | "delete"
            | "head"
            | "HEAD"
            | "OPTIONS"
            | "post"
            | "put"
            | "patch"
            | "PATCH"
            | "link"
            | "LINK"
            | "unlink"
            | "UNLINK"
            | undefined,
        path: string,
        data: object | null,
        requestHeaders: types.Headers = {},
        phoneNumber: string,
        fullPath: boolean
    ) {
        let clientKey: string = this.clientKey;
        // let storage: LocalStorage | undefined = this.storage;
        let host: string = this.options.host;
        let protocol: string | undefined = this.options.protocol;
        let classHeaders: types.Headers | undefined = this.options.headers;

        const uri: string = fullPath
            ? path
            : `${protocol}://${host}/${removeLeadingSlash(path)}`;

        const customHeaders = {
            ...classHeaders,
            ...requestHeaders
        };

        let accessToken: string;
        let jsonCreds: any;

        if (this.storage) {
            jsonCreds = this.storage.get(phoneNumber);
        }

        let credentials = new Credentials(
            jsonCreds.clientKey,
            jsonCreds.consumerId,
            jsonCreds.accessToken,
            jsonCreds.refreshToken,
            phoneNumber,
            jsonCreds.isNewUser
        );

        if (!phoneNumber) {
            throw new Error("You must have a PhoneNumber set");
        }

        accessToken =
            // @ts-ignore
            !credentials ||
            !credentials.accessToken ||
            // credentials.clientKey !== clientKey ||
            credentials.isExpired
                ? await this.authenticate(phoneNumber)
                : credentials.accessToken;

        // const body = customHeaders['Content-Type'] ? data : {  }

        try {
            const response = await axios({
                method: method,
                url: uri,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                    ...customHeaders
                },
                data: JSON.stringify(JSON.stringify(data))
            });

            const json = await response.data;

            if (response.status !== 200) {
                throw {
                    statusCode: response.status,
                    ...json
                };
            }

            return json;
        } catch (error) {
            console.error(error);

            return null;
        }

        // if (response.status === 204) return response.text()
    }

    async authenticateV2(PhoneNumber: string) {
        const storedCreds = this.storage?.get(PhoneNumber);
        if (storedCreds) {
            const creds = Credentials.FromJSON(storedCreds);

            if (!creds.isExpired) {
                return storedCreds;
            }
        }

        let clientKey: string = this.clientKey;
        let clientSecret: string = this.clientSecret;
        // let storage: LocalStorage | undefined = this.storage;
        let options: types.Options | undefined = this.options;

        let host: string | undefined = options?.host;
        let protocol: string | undefined = options?.protocol;
        let classHeaders: types.Headers | undefined = options?.headers;

        if (!clientKey) {
            throw new Error("You must provide a clientKey");
        }

        if (!clientSecret) {
            throw new Error("You must provide a clientSecret");
        }

        const uri: string = `${protocol}://${host}/authtoken`;

        const body: types.AuthRequest = {
            PhoneNumber: `+${PhoneNumber}`
        };

        const credentialsEncoded = btoa(
            JSON.stringify({
                DevelopmentSecret: clientSecret,
                DevelopmentKey: clientKey
            })
        );

        const response = await axios({
            method: "POST",
            url: `http://0.0.0.0:3030/${uri}`,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                CustomAuth: credentialsEncoded
            },
            data: body
        });

        let data = await response.data;

        if (!data.AccessToken) {
            throw new Error("Unable to obtain an access token");
        }

        const isNewUser = PhoneNumber == "14028049934" ? false : data.IsNewUser;

        console.log("data", data);
        const credentials = new Credentials(
            clientKey,
            data.ConsumerId,
            data.AccessToken,
            data.RefreshToken,
            PhoneNumber,
            isNewUser
        );

        this.storage.set(PhoneNumber, credentials.toString());

        return credentials;
    }

    async authenticate(PhoneNumber: string) {
        const storedCreds = this.storage?.get(PhoneNumber);
        if (storedCreds) {
            const creds = Credentials.FromJSON(storedCreds);

            if (!creds.isExpired) {
                return storedCreds;
            }
        }

        let clientKey: string = this.clientKey;
        let clientSecret: string = this.clientSecret;
        // let storage: LocalStorage | undefined = this.storage;
        let options: types.Options | undefined = this.options;

        let host: string | undefined = options?.host;
        let protocol: string | undefined = options?.protocol;
        let classHeaders: types.Headers | undefined = options?.headers;

        if (!clientKey) {
            throw new Error("You must provide a clientKey");
        }

        if (!clientSecret) {
            throw new Error("You must provide a clientSecret");
        }

        const uri: string = `${protocol}://${host}/dev/authtoken`;

        const body: types.AuthRequest = {
            PhoneNumber: `+${PhoneNumber}`
        };

        const credentialsEncoded = btoa(
            JSON.stringify({
                DevelopmentSecret: clientSecret,
                DevelopmentKey: clientKey
            })
        );

        const response = await axios({
            method: "POST",
            url: `${uri}`,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                CustomAuth: credentialsEncoded
            },
            data: body
        });

        let data = await response.data;

        if (!data.AccessToken) {
            throw new Error("Unable to obtain an access token");
        }

        console.log(data);

        const isNewUser = PhoneNumber === "14028049934" ? true : data.IsNewUser;
        const credentials = new Credentials(
            clientKey,
            data.ConsumerId,
            data.AccessToken,
            data.RefreshToken,
            PhoneNumber,
            isNewUser
        );

        this.storage.set(PhoneNumber, credentials.toString());

        return credentials;
    }

    post(
        path: string,
        data: object,
        headers?: types.Headers,
        phoneNumber: string = "",
        fullPath: boolean = false
    ) {
        return this.request("POST", path, data, headers, phoneNumber, fullPath);
    }

    get(
        path: string,
        headers?: types.Headers,
        phoneNumber: string = "",
        fullPath: boolean = false
    ) {
        return this.request("GET", path, null, headers, phoneNumber, fullPath);
    }

    put(
        path: string,
        data: object,
        headers?: types.Headers,
        phoneNumber: string = "",
        fullPath: boolean = false
    ) {
        return this.request("PUT", path, data, headers, phoneNumber, fullPath);
    }

    delete(
        path: string,
        data: object,
        headers?: types.Headers,
        phoneNumber: string = "",
        fullPath: boolean = false
    ) {
        return this.request("DELETE", path, data, headers, phoneNumber, fullPath);
    }
}
