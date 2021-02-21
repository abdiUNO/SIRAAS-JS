import {  h } from 'preact';

import Logo from './Logo'

function TrackButtonOutline() {
  return (
    <div>
      <style jsx>
        {`
          .container span {
            font-size: 1.125rem;
            font-weight: 700;
          }

          input[type='tel'] {
            width: 199px;
            padding: 4px 8px;
            margin-top: 15px;
            /*-webkit-box-shadow: inset 0 0 0 2px #000000;*/
            /*box-shadow: inset 0 0 0 2px #000000;*/
            margin: 0;
            padding: 1em 1em;
            font-family: GTWalsheim, Helvetica, Arial, sans-serif;
            font-size: 1rem;
            /*-webkit-box-shadow: 0 0 0 1px #637381;*/
            /*box-shadow: 0 0 0 1px #ffffff;*/
            border: 1px solid;
            background-color: #ffffff;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            border-color: #8996a3;
            -webkit-box-shadow: 0 0 0 0.1rem transparent;
            box-shadow: 0 0 0 0.1rem transparent;
            -webkit-transition: border-color 100ms cubic-bezier(0.64, 0, 0.35, 1),
              -webkit-box-shadow 100ms cubic-bezier(0.64, 0, 0.35, 1);
            transition: border-color 100ms cubic-bezier(0.64, 0, 0.35, 1),
              -webkit-box-shadow 100ms cubic-bezier(0.64, 0, 0.35, 1);
            transition: box-shadow 100ms cubic-bezier(0.64, 0, 0.35, 1),
              border-color 100ms cubic-bezier(0.64, 0, 0.35, 1);
            transition: box-shadow 100ms cubic-bezier(0.64, 0, 0.35, 1),
              border-color 100ms cubic-bezier(0.64, 0, 0.35, 1),
              -webkit-box-shadow 100ms cubic-bezier(0.64, 0, 0.35, 1);
          }

          input[type='tel']:focus {
            outline: none;
          }

          input[type='button'] {
            padding: 1em 1.4em;
            font-family: GTWalsheim, Helvetica, Arial, sans-serif;
            font-weight: 700;
            font-size: 1em;
            -webkit-font-smoothing: antialiased;
            -webkit-transition: 150ms ease;
            transition: 150ms ease;
            -webkit-transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, box-shadow, color;
            transition-property: background-color, border-color, box-shadow, color,
              -webkit-box-shadow;
            text-align: center;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
            -webkit-box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.15);
            box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.15);
            background-color: #ff4282;
            color: #ffffff;
            border-width: 0;
            border-style: solid;
            border-color: transparent;
          }

          .phone {
            margin-bottom: 25px;
          }

          .code input[type='tel'] {
            width: 100px;
          }

          .greciept-form {
            margin: 0 auto;
            margin-top: 15px;
          }

          .p {
            padding-top: 30px;
          }

          #greceipt-container {
          }

          .greciept-button {
            display: flex;
            flex-display: row;

            font-family: GTWalsheim, Helvetica, Arial, sans-serif;
            font-weight: 700;
            -webkit-font-smoothing: antialiased;
            -webkit-transition: 150ms ease;

            transition: 150ms ease;
            -webkit-transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, box-shadow, color;
            transition-property: background-color, border-color, box-shadow, color,
              -webkit-box-shadow;
            text-align: center;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
            text-align: center;
            align-items: center;
          }

          .greciept-button .greciept-button-text {
            box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.15);

            display: flex;
            flex-display: row;
            justify-content: center;
            align-items: center;
            padding: 0.8em 1em;
            border: 2px solid #ff4282;
            color: #ff4282;
            border-radius: 5px;
            border-bottom-right-radius: 0px;
            border-top-right-radius: 0px;
            border-right-width: 1px;
            height: 50px;
            min-height: 50px;
            max-height: 75px;
          }

          .greciept-button .logo {
            box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.15);

            display: flex;
            /* flex: initial; */
            flex-direction: row;
            align-items: center;
            justify-content: center;

            padding: 0.8em 1em;
            border: 2px solid #ff4282;
            color: #ff4282;
            border-radius: 5px;
            border-bottom-left-radius: 0px;
            border-top-left-radius: 0px;
            border-left-width: 0px;

            height: 50px;
            min-height: 50px;
            max-height: 75px;
          }

          .greciept-button img {
            height: 100%;
            margin: 0px 5px 0px 0px;
          }

          .greciept-button-text {
            font-weight: 500 !important;
            font-size: 15px !important;
          }

          .greciept-button .logo-text {
            font-weight: 600;
          }
        `}
      </style>
      <a href="#" className="greciept-button">
        <span className="greciept-button-text">Track receipt with</span>
        <div className="logo">
          <Logo />
          <span className="logo-text">{` SIRAAS`}</span>
        </div>
      </a>
    </div>
  )
}

export default function TrackButton(props: any) {
  let toggle: any = props.toggle
  return (
    <div>
      <style jsx>{`
        #container {
          display: flex;
          flex-display: row;

          font-family: GTWalsheim, Helvetica, Arial, sans-serif;
          font-weight: 700;
          -webkit-font-smoothing: antialiased;
          -webkit-transition: 150ms ease;

          transition: 150ms ease;
          -webkit-transition-property: background-color, border-color, color, -webkit-box-shadow;
          transition-property: background-color, border-color, color, -webkit-box-shadow;
          transition-property: background-color, border-color, box-shadow, color;
          transition-property: background-color, border-color, box-shadow, color, -webkit-box-shadow;
          text-align: center;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          cursor: pointer;
          text-align: center;
          align-items: center;
        }

        #container div {
          border-radius: 5px;

          display: flex;
          flex-display: row;
          justify-content: center;
          align-items: center;
          padding: 0.5em 1em 0.6em;
          border: 2px solid #ff4282;
          color: #ff4282;
          min-height: 45px;
          max-height: 65px;
          height: 45px;
        }

        #container .label {
          border-bottom-left-radius: 0px;
          border-top-left-radius: 0px;
        }

        #container .logo {
          border-bottom-right-radius: 0px;
          border-top-right-radius: 0px;
          border-right-width: 0px;
        }

        img {
          height: 80%;
          margin: 0px;
        }

        .greciept-button-text {
          font-weight: 500 !important;
          font-size: 15px !important;
        }
      `}</style>
      <div id="container" onClick={toggle}>
        <div className="logo">
          <Logo />
        </div>
        <div className="label">
          <span className="greciept-button-text">Track receipt with SIRAAS</span>
        </div>
      </div>
    </div>
  )
}
