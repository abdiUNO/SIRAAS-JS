import { render, h } from 'preact';
interface Props {
  id?: string
  className?: string
  children?: any
  onClick?(e: any): any
  success?: boolean
}

const Button = (props: Props) => {
  const { children, ...rest } = props

  const backgroundColor = '#00A4BC'
  return (
    <div>
      <style jsx>
        {`
          button {
            display: flex;
            flex-display: row;
            flex: 1;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            font-family: 'Open Sans', Arial, sans-serif;
            transition: 150ms ease;
            -webkit-transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, color, -webkit-box-shadow;
            transition-property: background-color, border-color, box-shadow, color;
            transition-property: background-color, border-color, box-shadow, color;
            text-align: center;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
            background-color: ${backgroundColor};
            color: #ffffff;
            border-style: solid;
            border-color: transparent;
            border-radius: 5px;
            padding-top: 0.6em;
            padding-right: 1.8em;
            padding-bottom: 0.6em;
            padding-left: 1.8em;
            width: 100%;
            min-height: 54px;
            max-height: 65px;
          }
        `}
      </style>
      <button {...rest} disabled={props.success}>
        {children}
      </button>
    </div>
  )
}

export default Button
