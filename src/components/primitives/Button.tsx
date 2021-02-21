import { h,Component } from 'preact';
import styled  from 'styled-components'
import { space, layout, flexbox, variant } from 'styled-system'
// @ts-ignore
import { pick } from '@styled-system/props'

const sizeVariants = variant({
  variants: {
    primary: {
      backgroundColor: '#12243f',
    },
    disabled: {
      backgroundColor: '#58595B',
    },
  },
})

const StyledButton = styled.button`
  padding: 10.2px 12px 8.5px 12px;
  background-color: #12243f;
  border-radius: 2.5px;
  justify-content: center;
  align-items: center;
  ${space}
  ${layout}
    ${flexbox}
    ${sizeVariants}
`

const StyledText = styled.p`
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  padding-top: 1px;
  font-family: Poppins;
  font-weight: 400;
`

class Button extends Component {
  render() {
    const { onPress, style, titleStyle, disabled, title }: any = this.props
    const btnProp = !disabled
      ? {
          onClick: onPress,
        }
      : {}
    const wrapperProps = {
      ...pick(this.props),
    }

    return (
      <StyledButton
        {...btnProp}
        style={style}
        {...wrapperProps}
        disabled={disabled}
        variant={!disabled ? 'primary' : 'disabled'}
      >
        <div style={{ flex: 1 }}>
          <StyledText style={titleStyle}>{title.toUpperCase()}</StyledText>
        </div>
      </StyledButton>
    )
  }
}

export default Button
