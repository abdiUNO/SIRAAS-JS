/** @jsx h */
import { h } from "preact";
// @ts-ignore
import { useState, useEffect, useRef } from "preact/hooks";
import Box from "./primitives/Box";

import MemoryStorageFactory from "../factories/memory-storage";

import Container from "./container";
import "./style.scss";
const storage = new MemoryStorageFactory();

function App({ client, authenticated, isNewUser }: any) {
    const [state, setState] = useState({ toggled: false, phoneNumber: null });
    const { toggled, phoneNumber } = state;

    let toggle = () => setState({ ...state, toggled: true });

    return (
        <div>
            <style jsx>
                {`
                    .box {
                        margin: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        background-color: #fff;
                        border-radius: 5px;
                        border: "0px";
                        margin: 0 auto 20px auto;
                        width: 100%;
                    }

                    .box-body {
                        display: flex;
                        width: 100%;
                        align-self: flex-end;
                    }

                    section {
                        width: 100%;
                        color: #000;
                        padding: 20px;
                    }
                `}
            </style>

            <Box padding={4}>
                <Container
                    onSubmit={(res) => {
                        console.log(res);
                        client.Authenticate({
                            onSubmit: () => console.log("Submitted"),
                            onSuccess: () => setAuth(true)
                        });
                    }}
                    authenticated={authenticated}
                    storage={storage}
                    toggle={toggle}
                    toggled={state.toggled}
                    isNewUser={isNewUser}
                />
            </Box>
        </div>
    );
}

export default App;
