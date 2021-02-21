// @ts-ignore
import { Fragment, h, render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import Box from "../primitives/Box";
import "./style.scss";
import { StorageFactory } from "../../types";
import Input from "../Input";
import Button from "../Button";
import Amplify, { Auth } from "aws-amplify";
import config from "../../../amplify-config";

const NOTSIGNIN = "You are NOT logged in";
const SIGNEDIN = "You have logged in successfully";
const SIGNEDOUT = "You have logged out successfully";
const WAITINGFOROTP = "Enter OTP number";
const VERIFYNUMBER = "Verifying number (Country code +XX needed)";
Amplify.configure(config);

interface Props {
    authenticated: boolean;

    onSubmit(res: any): any;

    storage: StorageFactory;
    toggled: boolean;

    toggle(): any;
}

interface Props {
    onSubmit(res: any): any;

    storage: StorageFactory;
    toggled: boolean;

    toggle(): any;

    isNewUser: boolean;
}

interface PhoneProps {
    onSubmit(phoneNumber: any): any;

    isNewUser: boolean;
    success?: boolean;
}

export function PhoneLabel() {
    return (
        <div>
            <style jsx>
                {`
                    #phone-description {
                        margin: 0px 0 10px;
                        font-size: 0.85714em !important;
                        line-height: 1.25;
                        font-weight: 600;
                        font-family: Montserrat, sans-serif;
                        color: #2b2b2b;
                    }
                `}
            </style>
            <div id="phone-description">What is your phone number?</div>
        </div>
    );
}

const SVGIcon = () => (
    <svg width="16px" height="13px" viewBox="0 0 16 13" version="1.1">
        <title>Path</title>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="check" transform="translate(0.250000, 9.250000)" />
            <path
                d="M12.9068479,1.10455136 C13.4419764,0.571388172 14.3039146,0.568997957 14.8419621,1.09918515 C15.3800095,1.62937234 15.3946983,2.495583 14.8749395,3.04389136 L7.53915828,12.2603739 C7.28441332,12.5361568 6.92899966,12.6959011 6.55465567,12.7028688 C6.18031167,12.7098364 5.81925728,12.5634276 5.5545281,12.2973137 L0.694021778,7.41017686 C0.325297379,7.06484398 0.173517266,6.54475923 0.298224883,6.05395224 C0.422932501,5.56314524 0.804238077,5.1798954 1.29255517,5.0545519 C1.78087226,4.92920841 2.29831857,5.08176244 2.64189955,5.45236695 L6.48987695,9.31811803 L12.8719331,1.14518515 C12.883322,1.13087761 12.8955971,1.11730608 12.9086855,1.10455136 L12.9068479,1.10455136 Z"
                id="Path"
                fill="#ffffff"
                fillRule="nonzero"
            />
        </g>
    </svg>
);

const LoadingSpinner = () => (
    <div
        style={{
            display: "flex",
            flex: 1,
            border: "solid 1px #d0d9dd",
            borderRadius: 3,
            width: "100%",
            height: "100%"
        }}
    />
);

function RedeemPoints({ onSubmit }: any) {
    const [state, setState] = useState({
        submitted: false,
        authenticated: false,
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        loading: false,
        _submit: false
    });

    const [message, setMessage] = useState(
        "Make sure you can receive SMS to this number so that we can send you a code"
    );
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [number, setNumber] = useState("");
    // const { signIn: ReduxSignIn } = React.useContext(NavContext);

    const password = Math.random().toString(10) + "Abc#";
    // useEffect(() => {
    //   verifyAuth()
    // }, [])

    const verifyAuth = () => {
        Auth.currentAuthenticatedUser()
            .then((user) => {
                setUser(user);
                setMessage(SIGNEDIN);
                setSession(null);
            })
            .catch((err) => {
                console.error(err);
                setMessage(NOTSIGNIN);
            });
    };
    const signOut = () => {
        if (user) {
            Auth.signOut();
            setUser(null);
            setLoading(false);
            setMessage(SIGNEDOUT);
        } else {
            setMessage(NOTSIGNIN);
        }
    };
    const signIn = () => {
        console.log(number);
        setMessage(VERIFYNUMBER);
        Auth.signIn(`+14028049934`, null)
            .then((result) => {
                console.log(result);
                setSession(result);
                setMessage(WAITINGFOROTP);
            })
            .catch((e) => {
                console.log(e);
                if (e.code === "UserNotFoundException") {
                    signUp();
                } else if (e.code === "UsernameExistsException") {
                    setMessage(WAITINGFOROTP);
                    signIn();
                } else {
                    console.log(e.code);
                    console.error(e);
                }
            });
    };
    const signUp = async () => {
        const phoneNumber = `+14028049934`;
        const result = await Auth.signUp({
            username: phoneNumber,
            password,
            attributes: {
                phone_number: phoneNumber
            }
        })
            .then(() => signIn())
            .catch((e) => {
                if (e.code === "UsernameExistsException") {
                    Auth.resendSignUp(phoneNumber).then(() => setMessage(WAITINGFOROTP));
                    // setMessage(WAITINGFOROTP)
                    // signIn()
                }
            });
        return result;
    };
    const verifyOtp = (code) => {
        const phoneNumber = `+14028049934`;
        setLoading(true);
        console.log("otp", code);
        Auth.confirmSignIn(phoneNumber, code)
            .then((user) => {
                setLoading(false);
                setUser(user);
                setMessage(SIGNEDIN);
                setSession(null);
                // ReduxSignIn();
            })
            .catch((err) => {
                setMessage(err.message);
                // setOtp('')
                console.log(err);
            });
    };

    useEffect(() => {
        const { code1, code2, code3, code4, code5, code6, loading, _submit } = state;

        if (code1 && code2 && code3 && code4 && code5 && code6) {
            let timer = null;
            if (_submit) onSubmit();
            if (!loading) {
                setState({ ...state, loading: true });
                console.log(state);
                const otpCode = `${code1}${code2}${code3}${code4}${code5}${code6}`;
                console.log(otpCode);
                verifyOtp(otpCode);
                if (!_submit) setState({ ...state, _submit: true });
            }

            return () => window.clearInterval(timer);
        }
    }, [state]);
    const handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        setState({
            ...state,
            [name]: value
        });
    };

    console.log(state);

    const { code1, code2, code3, code4, code5, code6 } = state;
    return !state.submitted ? (
        <div id="wrapper">
            <style jsx>
                {`
                    #wrapper {
                        display: flex;
                        flex: 1;
                        flex-direction: column;
                        align-items: center;
                        height: 100%;
                    }
                `}
            </style>
            <Button
                onClick={() => {
                    setState({ ...state, submitted: true });
                    signIn();
                }}
            >
                Redeem Points
            </Button>
        </div>
    ) : (
        <div>
            <style jsx>
                {`
                    /**
         * ==============================================
         * Dot Falling
         * ==============================================
         */
                    #dot-wrapper {
                        width: 10px;
                        height: 10px;
                    }

                    .dot-falling {
                        position: relative;
                        left: -9999px;
                        width: 10px;
                        height: 10px;
                        border-radius: 5px;
                        background-color: #00a4bc;
                        color: #00a4bc;
                        box-shadow: 9999px 0 0 0 #00a4bc;
                        animation: dotFalling 1s infinite linear;
                        animation-delay: 0.1s;
                    }

                    .dot-falling::before,
                    .dot-falling::after {
                        content: "";
                        display: inline-block;
                        position: absolute;
                        top: 0;
                    }

                    .dot-falling::before {
                        width: 10px;
                        height: 10px;
                        border-radius: 5px;
                        background-color: #00a4bc;
                        color: #9880ff;
                        animation: dotFallingBefore 1s infinite linear;
                        animation-delay: 0s;
                    }

                    .dot-falling::after {
                        width: 10px;
                        height: 10px;
                        border-radius: 5px;
                        background-color: #00a4bc;
                        color: #00a4bc;
                        animation: dotFallingAfter 1s infinite linear;
                        animation-delay: 0.2s;
                    }

                    @keyframes dotFalling {
                        0% {
                            box-shadow: 9999px -15px 0 0 rgba(152, 128, 255, 0);
                        }
                        25%,
                        50%,
                        75% {
                            box-shadow: 9999px 0 0 0 #00a4bc;
                        }
                        100% {
                            box-shadow: 9999px 15px 0 0 rgba(152, 128, 255, 0);
                        }
                    }

                    @keyframes dotFallingBefore {
                        0% {
                            box-shadow: 9984px -15px 0 0 rgba(152, 128, 255, 0);
                        }
                        25%,
                        50%,
                        75% {
                            box-shadow: 9984px 0 0 0 #00a4bc;
                        }
                        100% {
                            box-shadow: 9984px 15px 0 0 rgba(152, 128, 255, 0);
                        }
                    }

                    @keyframes dotFallingAfter {
                        0% {
                            box-shadow: 10014px -15px 0 0 rgba(152, 128, 255, 0);
                        }
                        25%,
                        50%,
                        75% {
                            box-shadow: 10014px 0 0 0 #00a4bc;
                        }
                        100% {
                            box-shadow: 10014px 15px 0 0 rgba(152, 128, 255, 0);
                        }
                    }

                    /*# sourceMappingURL=three-dots.css.map */
                    #phone-description {
                        margin: 0px 0 10px;
                        font-size: 0.85714em !important;
                        line-height: 1.25;
                        font-weight: 600;
                        font-family: Montserrat, sans-serif;
                        color: #2b2b2b;
                    }

                    #wrapper {
                        display: flex;
                        flex: 1;
                        flex-direction: column;
                        padding-bottom: 21px;
                    }

                    #code-inputs {
                        flex-direction: row;
                    }

                    #wrapper #form {
                        display: flex;
                        flex: 1;
                    }

                    #wrapper #form input {
                        margin: 0 5px;
                        text-align: center;
                        line-height: 57px;
                        font-size: 19px;
                        font-family: "Montserrat", sans-serif;
                        font-weight: 600;
                        border: solid 1px #d0d9dd;
                        outline: none;
                        -webkit-transition: all 0.2s ease-in-out;
                        transition: all 0.2s ease-in-out;
                        border-radius: 3px;
                        max-height: 54px;
                        padding-left: 10px;
                        padding-right: 10px;
                    }

                    #wrapper #form input::-moz-selection {
                        background: transparent;
                    }

                    #wrapper #form input::selection {
                        background: transparent;
                    }
                `}
            </style>

            <div id="wrapper">
                <div id="phone-description">{message}</div>
                {state.loading ? (
                    <div id="dot-wrapper">
                        <div className="dot-falling" />
                    </div>
                ) : (
                    <div id="form">
                        <input
                            name="code1"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code1}
                        />
                        <input
                            name="code2"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code2}
                        />
                        <input
                            name="code3"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code3}
                        />
                        <input
                            name="code4"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code4}
                        />
                        <input
                            name="code5"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code5}
                        />
                        <input
                            name="code6"
                            type="text"
                            maxLength={1}
                            size={1}
                            min="0"
                            max="9"
                            pattern="[0-9]{1}"
                            onChange={handleInputChange}
                            value={code6}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function RangeSlider() {
    const [state, setState] = useState({
        rangeValue: 1
    });

    const minValue = 1;
    const maxValue = 11;
    const active = "#CAEDF2";
    const inactive = "#E0EAEF";
    const inputRef = useRef(null);

    const handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        setState({
            ...state,
            [name]: value
        });

        const progress = (value / maxValue) * 100 + "%";
        const newBackgroundStyle = `linear-gradient(90deg, ${active} 0% ${progress}%,   ${inactive} ${progress}% 100%)`;
        if (inputRef !== null) {
            // @ts-ignore
            inputRef.current.style.background = newBackgroundStyle;
        }
    };

    const progress = (state.rangeValue / maxValue) * 100 + "%";

    const styleInput = {
        background: `linear-gradient(90deg, ${active} 0% ${progress},   ${inactive} ${progress} 100%)`
    };

    let leftPts = (state.rangeValue / maxValue) * 75;
    let rightPts = ((maxValue - state.rangeValue) / maxValue) * 75;

    const val = state.rangeValue;
    const min = 1;
    const max = 12;
    const newVal = Number(((val - min) * 100) / (max - min));
    console.log(leftPts);

    return (
        <div>
            <style jsx>{`
                #slider-wrapper {
                    position: relative;
                    padding: 13px 4px 22px 14px;
                    border-radius: 6px;
                    border: solid 1px #e0eaef;
                }

                #total-wrapper {
                    position: relative;
                    padding: 13px 15px 22px 15px;
                    border-radius: 6px;
                    background-color: #f5f8fa;
                }

                .slidecontainer {
                    border: 1px solid #d0d9dd;
                    border-radius: 12px;
                    height: 24px;
                    padding-top: 1px;
                    padding-left: 1px;
                    padding-right: 1px;
                    margin-right: 15px;
                    position: relative;
                }

                input[type="range"] {
                    position: absolute;
                    -webkit-appearance: none;
                    width: 100%;
                    height: 20px;
                    background: #e0eaef;
                    outline: none;
                    -webkit-transition: 0.2s;
                    transition: opacity 0.2s;
                    border: 1px solid #fff;
                    border-radius: 12px;
                    margin-left: -2px;
                }

                input[type="range"]:focus {
                    outline: none;
                }

                .slider::-webkit-slider-thumb {
                    z-index: 5;
                    position: relative;
                    -webkit-appearance: none;
                    appearance: none;
                    width: 25px;
                    height: 25px;
                    background: #00a4bc;
                    cursor: pointer;
                }

                .slider::-moz-range-thumb {
                    width: 25px;
                    height: 25px;
                    background: #00a4bc;
                    cursor: pointer;
                }

                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    input[type="range"]::-webkit-slider-runnable-track {
                        height: 10px;
                        -webkit-appearance: none;
                        color: #13bba4;
                    }

                    input[type="range"]::-webkit-slider-thumb {
                        width: 28px;
                        height: 28px;
                        -webkit-appearance: none;
                        margin-top: -9px;
                        cursor: ew-resize;
                        background: #00a4bc;
                        border-radius: 25px;
                        border: none;

                        //box-shadow: -80px 0 0 20px #caedf2;
                    }
                }

                /** FF*/
                input[type="range"]::-moz-range-progress {
                    background-color: #43e5f7;
                }

                input[type="range"]::-moz-range-track {
                    background-color: #9a905d;
                }

                /* IE*/
                input[type="range"]::-ms-fill-lower {
                    background-color: #43e5f7;
                }

                input[type="range"]::-ms-fill-upper {
                    background-color: #9a905d;
                }
            `}</style>
            <Box display="flex" flexDirection="row">
                <Box width={0.7} mr={24}>
                    <div id="slider-wrapper">
                        <p
                            style={{
                                fontFamily: "Montserrat",
                                fontSize: 13,
                                fontWeight: 600,
                                fontStretch: "normal",
                                fontStyle: "normal",
                                lineHeight: 1.25,
                                letterSpacing: "normal",
                                textAlign: "left",
                                color: "#2b2b2b",
                                marginBottom: 25
                            }}
                        >
                            Purchase Points
                        </p>
                        <div className="slidecontainer">
                            <p
                                style={{
                                    position: "absolute",
                                    fontFamily: "Montserrat",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.75,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#00a4bc",
                                    paddingLeft: leftPts,
                                    visibility:
                                        state.rangeValue <= 1 ? "hidden" : "initial",
                                    zIndex: 5
                                }}
                            >
                                {state.rangeValue - 1}pts
                            </p>
                            <p
                                style={{
                                    position: "absolute",
                                    fontFamily: "Montserrat",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.75,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#000000",
                                    marginLeft: 12,
                                    left: `calc(${newVal}% + (${8 - newVal * 0.25}px))`,
                                    zIndex: 5,
                                    marginTop: -25
                                }}
                            >
                                ${state.rangeValue - 1}
                            </p>
                            <p
                                style={{
                                    position: "relative",
                                    fontFamily: "Montserrat",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.75,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#000000",
                                    paddingRight: rightPts,
                                    visibility:
                                        state.rangeValue >= 11 ? "hidden" : "initial",
                                    float: "right",
                                    right: 0,
                                    zIndex: 5
                                }}
                            >
                                {maxValue - state.rangeValue - 1}pts
                            </p>

                            <input
                                className="slider"
                                id="typeinp"
                                min={minValue}
                                max={maxValue}
                                step="1"
                                name="rangeValue"
                                value={state.rangeValue}
                                ref={inputRef}
                                onChange={handleInputChange}
                                style={styleInput}
                                type="range"
                            />
                        </div>
                    </div>
                </Box>
                <Box width={0.3} alignItems="center">
                    <div id="total-wrapper">
                        <p
                            style={{
                                textTransform: "uppercase",
                                fontFamily: "Montserrat",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 4,
                                fontStretch: "normal",
                                fontStyle: "normal",
                                lineHeight: 1.25,
                                letterSpacing: "normal",
                                textAlign: "left",
                                color: "#000000"
                            }}
                        >
                            Total
                        </p>
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                        >
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 32,
                                    fontWeight: "bold",
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.22,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#000000"
                                }}
                            >
                                ${(maxValue - 1) * 1}
                            </p>
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.75,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#000000",
                                    margin: "14px 0px 16px 0px"
                                }}
                            >
                                {maxValue - 1} Points
                            </p>
                        </Box>
                        <Box bg="#e0eaef" height={1} width={1} mb={12} />
                        <p
                            style={{
                                textTransform: "uppercase",
                                fontFamily: "Montserrat",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 4,
                                fontStretch: "normal",
                                fontStyle: "normal",
                                lineHeight: 1.25,
                                letterSpacing: "normal",
                                textAlign: "left",
                                color: "#000000"
                            }}
                        >
                            Redeem
                        </p>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="baseline"
                            justifyContent="space-between"
                        >
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.25,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#00a4bc"
                                }}
                            >
                                ${state.rangeValue - 1}
                            </p>
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.25,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#00a4bc"
                                }}
                            >
                                {state.rangeValue - 1} Points
                            </p>
                        </Box>

                        <Box bg="#e0eaef" height={1} mt={12} width={1} mb={12} />

                        <p
                            style={{
                                textTransform: "uppercase",
                                fontFamily: "Montserrat",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 4,
                                fontStretch: "normal",
                                fontStyle: "normal",
                                lineHeight: 1.25,
                                letterSpacing: "normal",
                                textAlign: "left",
                                color: "#000000"
                            }}
                        >
                            REMAINING
                        </p>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="baseline"
                            justifyContent="space-between"
                        >
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.25,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#7c839b"
                                }}
                            >
                                ${maxValue - state.rangeValue}
                            </p>
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    fontStretch: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 1.25,
                                    letterSpacing: "normal",
                                    textAlign: "left",
                                    color: "#7c839b"
                                }}
                            >
                                {maxValue - state.rangeValue} Points
                            </p>
                        </Box>
                    </div>
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" mt="12px">
                <Box width={0.7} mr={24} />
                <Box width={0.3} alignItems="center">
                    <Button>Redeem Points</Button>
                </Box>
            </Box>
        </div>
    );
}

function PhoneInput({ onSubmit, success = false, isNewUser }: PhoneProps) {
    const [state, setState] = useState({
        loading: false,
        phoneNumber: 0,
        invalid: false,
        blur: true,
        pinSubmitted: false
    });

    useEffect(() => {
        console.log(state.phoneNumber);

        if (!state.invalid && state.phoneNumber) {
            console.log(state.phoneNumber);
            onSubmit(state.phoneNumber);
            // setState({ ...state, loading: true });
        }
    }, [state]);

    let onChange = (data: any, props: any) => {
        console.log(data);
        setState({ ...state, phoneNumber: data, ...props });
    };

    return (
        <Box display="flex" flexDirection="column">
            <PhoneLabel />

            <Box display="flex" flexDirection="row" alignItems="center">
                <Box width={0.7} mr={24}>
                    <Input
                        isNewUser={isNewUser}
                        id={"phonenum"}
                        onChange={(name, obj: any) => {
                            const { value, invalid, blur, ...rest } = obj;
                            console.log(value, invalid, blur);

                            value.replace("-", "");
                            onChange(
                                { value: parseInt(value, 10), ...rest },
                                { invalid, blur }
                            );
                        }}
                        type={"tel"}
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        required
                        placeholder={"Phone number"}
                        success={success}
                    />
                </Box>
                <Box
                    width={
                        (state.pinSubmitted || state.invalid || !success || isNewUser) &&
                        0.3
                    }
                    alignItems="center"
                >
                    {state.pinSubmitted || state.invalid || !success || isNewUser ? (
                        <Box display={"flex"} flex={1} flexDirection="column" mt={2.5}>
                            <Box
                                display={"flex"}
                                flex={1}
                                flexDirection="row"
                                alignItems="center"
                            >
                                <div
                                    style={{
                                        borderRadius: 15,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "rgba(0,164,188,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        marginRight: 9
                                    }}
                                >
                                    <div
                                        style={{
                                            borderRadius: 15,
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "rgba(0,164,188)",
                                            opacity: 1
                                        }}
                                    >
                                        <div />
                                    </div>
                                </div>
                                <p
                                    style={{
                                        textTransform: "uppercase",
                                        fontFamily: "Montserrat",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontStretch: "normal",
                                        fontStyle: "normal",
                                        lineHeight: 1.25,
                                        letterSpacing: "normal",
                                        textAlign: "left",
                                        color: "#2b2b2b",
                                        margin: 0
                                    }}
                                >
                                    Download SIRaaS
                                </p>
                            </Box>
                            <Box
                                display={"flex"}
                                mt={"5px"}
                                flex={1}
                                flexDirection="row"
                                alignItems="center"
                            >
                                <div
                                    style={{
                                        borderRadius: 15,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "rgba(0,164,188,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        marginRight: 9
                                    }}
                                >
                                    <div
                                        style={{
                                            borderRadius: 15,
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "rgba(0,164,188)",
                                            opacity: 1
                                        }}
                                    >
                                        <div />
                                    </div>
                                </div>
                                <p
                                    style={{
                                        textTransform: "uppercase",
                                        fontFamily: "Montserrat",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontStretch: "normal",
                                        fontStyle: "normal",
                                        lineHeight: 1.25,
                                        letterSpacing: "normal",
                                        textAlign: "left",
                                        color: "#2b2b2b",
                                        margin: 0
                                    }}
                                >
                                    Get your Receipt
                                </p>
                            </Box>
                            <Box
                                display={"flex"}
                                mt={"5px"}
                                flex={1}
                                flexDirection="row"
                                alignItems="center"
                            >
                                <div
                                    style={{
                                        borderRadius: 15,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "rgba(0,164,188,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        marginRight: 9
                                    }}
                                >
                                    <div
                                        style={{
                                            borderRadius: 15,
                                            width: 6,
                                            height: 6,
                                            backgroundColor: "rgba(0,164,188)",
                                            opacity: 1
                                        }}
                                    >
                                        <div />
                                    </div>
                                </div>
                                <p
                                    style={{
                                        textTransform: "uppercase",
                                        fontFamily: "Montserrat",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontStretch: "normal",
                                        fontStyle: "normal",
                                        lineHeight: 1.25,
                                        letterSpacing: "normal",
                                        textAlign: "left",
                                        color: "#2b2b2b",
                                        margin: 0
                                    }}
                                >
                                    Earn Points
                                </p>
                            </Box>
                        </Box>
                    ) : (
                        <RedeemPoints
                            onSubmit={() => setState({ ...state, pinSubmitted: true })}
                        />
                    )}

                    <p
                        style={{
                            fontFamily: "Montserrat",
                            fontSize: 13,
                            fontWeight: 600,
                            fontStretch: "normal",
                            fontStyle: "normal",
                            lineHeight: 1.25,
                            letterSpacing: "normal",
                            textAlign: "left",
                            color: "#fff",
                            marginTop: 5
                        }}
                    >
                        Wrong Format
                    </p>
                </Box>
            </Box>
            {state.pinSubmitted && <RangeSlider />}
        </Box>
    );
}

const Index = ({ onSubmit, toggled, toggle, authenticated, isNewUser }: Props) => {
    console.log(authenticated);
    return (
        <div>
            <style jsx>
                {`
                    .container {
                        font-size: 14px;
                        font-family: -apple-system, BlinkMacSystemFont, San Francisco,
                            Roboto, Segoe UI, Helvetica Neue, sans-serif;
                        font-weight: 400;
                        line-height: 1.5rem;
                        text-transform: none;
                        letter-spacing: normal;
                        height: 100%;

                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-orient: vertical;
                        -webkit-box-direction: normal;
                        -webkit-flex-direction: column;
                        -ms-flex-direction: column;
                        flex-direction: column;
                        -webkit-box-flex: 1;
                        -webkit-flex: 1 0 auto;
                        -ms-flex: 1 0 auto;
                        flex: 1 0 auto;

                        font-size: 14px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                            Helvetica, Arial, sans-serif, "Apple Color Emoji",
                            "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
                        line-height: 1.3em;
                        overflow-wrap: break-word;
                        word-wrap: break-word;
                        word-break: break-word;
                        -webkit-font-smoothing: subpixel-antialiased;

                        overflow-x: hidden;

                        margin: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .greciept-form {
                        width: 100%;
                        float: left;
                        padding-top: 0.4285714286em;
                        padding-bottom: 0.4285714286em;

                        -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                    }

                    .p {
                        padding-top: 30px;
                    }

                    .two-thirds {
                        width: 100%;
                    }
                `}
            </style>
            <Box className="two-thirds">
                <Box>
                    <div className="greciept-form">
                        <PhoneInput
                            onSubmit={onSubmit}
                            success={authenticated}
                            isNewUser={isNewUser}
                        />
                    </div>
                </Box>
            </Box>
        </div>
    );
};

export default Index;
