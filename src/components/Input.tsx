import {  h } from 'preact';

import { useState } from 'preact/hooks';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { debounce } from 'throttle-debounce'
interface CountryData {
  name: string
  dialCode: string
  countryCode: string
  format: string
}

interface IsValidProps {
  value: string
  country: CountryData
  countries: CountryData[]
  hiddenAreaCodes: object[]
}

interface Props {
  id?: string
  className?: string
  type?: string
  pattern?: string
  required?: boolean
  placeholder?: string
  onChange?(name: string, props: any): any
  success: boolean
  isNewUser: boolean
}

interface Dic {
  [key: string]: any
}

const phones: Dic = {
  'am-AM': /^(\+?374|0)((10|[9|7][0-9])\d{6}$|[2-4]\d{7}$)/,
  'ar-AE': /^((\+?971)|0)?5[024568]\d{7}$/,
  'ar-BH': /^(\+?973)?(3|6)\d{7}$/,
  'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
  'ar-EG': /^((\+?20)|0)?1[0125]\d{8}$/,
  'ar-IQ': /^(\+?964|0)?7[0-9]\d{8}$/,
  'ar-JO': /^(\+?962|0)?7[789]\d{7}$/,
  'ar-KW': /^(\+?965)[569]\d{7}$/,
  'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'ar-TN': /^(\+?216)?[2459]\d{7}$/,
  'be-BY': /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  'bg-BG': /^(\+?359|0)?8[789]\d{7}$/,
  'bn-BD': /^(\+?880|0)1[13456789][0-9]{8}$/,
  'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'da-DK': /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'de-DE': /^(\+49)?0?1(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7}$/,
  'de-AT': /^(\+43|0)\d{1,4}\d{3,12}$/,
  'el-GR': /^(\+?30|0)?(69\d{8})$/,
  'en-AU': /^(\+?61|0)4\d{8}$/,
  'en-GB': /^(\+?44|0)7\d{9}$/,
  'en-GG': /^(\+?44|0)1481\d{6}$/,
  'en-GH': /^(\+233|0)(20|50|24|54|27|57|26|56|23|28)\d{7}$/,
  'en-HK': /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  'en-MO': /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  'en-IE': /^(\+?353|0)8[356789]\d{7}$/,
  'en-IN': /^(\+?91|0)?[6789]\d{9}$/,
  'en-KE': /^(\+?254|0)(7|1)\d{8}$/,
  'en-MT': /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  'en-MU': /^(\+?230|0)?\d{8}$/,
  'en-NG': /^(\+?234|0)?[789]\d{9}$/,
  'en-NZ': /^(\+?64|0)[28]\d{7,9}$/,
  'en-PK': /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
  'en-RW': /^(\+?250|0)?[7]\d{8}$/,
  'en-SG': /^(\+65)?[89]\d{7}$/,
  'en-SL': /^(?:0|94|\+94)?(7(0|1|2|5|6|7|8)( |-)?\d)\d{6}$/,
  'en-TZ': /^(\+?255|0)?[67]\d{8}$/,
  'en-UG': /^(\+?256|0)?[7]\d{8}$/,
  'en-US': /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  'en-ZA': /^(\+?27|0)\d{9}$/,
  'en-ZM': /^(\+?26)?09[567]\d{7}$/,
  'es-CL': /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  'es-EC': /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
  'es-MX': /^(\+?52)?(1|01)?\d{10,11}$/,
  'es-PA': /^(\+?507)\d{7,8}$/,
  'es-PY': /^(\+?595|0)9[9876]\d{7}$/,
  'es-UY': /^(\+598|0)9[1-9][\d]{6}$/,
  'et-EE': /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  'fa-IR': /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5|6)?|50)\s?(\d\s?){4,8}\d$/,
  'fj-FJ': /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  'fo-FO': /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'fr-FR': /^(\+?33|0)[67]\d{8}$/,
  'fr-GF': /^(\+?594|0|00594)[67]\d{8}$/,
  'fr-GP': /^(\+?590|0|00590)[67]\d{8}$/,
  'fr-MQ': /^(\+?596|0|00596)[67]\d{8}$/,
  'fr-RE': /^(\+?262|0|00262)[67]\d{8}$/,
  'he-IL': /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
  'id-ID': /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  'ja-JP': /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  'kk-KZ': /^(\+?7|8)?7\d{9}$/,
  'kl-GL': /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'ko-KR': /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  'lt-LT': /^(\+370|8)\d{8}$/,
  'ms-MY': /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'ne-NP': /^(\+?977)?9[78]\d{8}$/,
  'nl-BE': /^(\+?32|0)4?\d{8}$/,
  'nl-NL': /^(\+?31|0)6?\d{8}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
  'pt-BR': /(?=^(\+?5{2}\-?|0)[1-9]{2}\-?\d{4}\-?\d{4}$)(^(\+?5{2}\-?|0)[1-9]{2}\-?[6-9]{1}\d{3}\-?\d{4}$)|(^(\+?5{2}\-?|0)[1-9]{2}\-?9[6-9]{1}\d{3}\-?\d{4}$)/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'ro-RO': /^(\+?4?0)\s?7\d{2}(\/|\s|\.|\-)?\d{3}(\s|\.|\-)?\d{3}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'sl-SI': /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  'sk-SK': /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
  'sv-SE': /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  'th-TH': /^(\+66|66|0)\d{9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'uk-UA': /^(\+?38|8)?0\d{9}$/,
  'vi-VN': /^(\+?84|0)((3([2-9]))|(5([2689]))|(7([0|6-9]))|(8([1-6|89]))|(9([0-9])))([0-9]{7})$/,
  'zh-CN': /^((\+|00)86)?1([358][0-9]|4[579]|6[67]|7[01235678]|9[189])[0-9]{8}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
}

const CheckMark = ({ color = '#7c839b' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22.416"
    height="22.027"
    viewBox="0 0 22.416 22.027"
  >
    <g id="check-circle_1_" data-name="check-circle (1)" transform="translate(-0.998 -0.982)">
      <path
        id="Path_2336"
        data-name="Path 2336"
        d="M22,11.08V12a10,10,0,1,1-5.93-9.14"
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        id="Path_2337"
        data-name="Path 2337"
        d="M22,4,12,14.01l-3-3"
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </g>
  </svg>
)

const TimesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <g id="x-octagon" transform="translate(-1 -1)">
      <path
        id="Path_2338"
        data-name="Path 2338"
        d="M7.86,2h8.28L22,7.86v8.28L16.14,22H7.86L2,16.14V7.86Z"
        fill="none"
        stroke="#fd1515"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <line
        id="Line_36"
        data-name="Line 36"
        x1="6"
        y2="6"
        transform="translate(9 9)"
        fill="none"
        stroke="#fd1515"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <line
        id="Line_37"
        data-name="Line 37"
        x2="6"
        y2="6"
        transform="translate(9 9)"
        fill="none"
        stroke="#fd1515"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </g>
  </svg>
)

const Input = (props: Props) => {
  const initState: any = { invalid: false, blur: null, focus: null, data: {}, value: null }
  const [state, setState] = useState(initState)
  const { invalid, focus, blur } = state

  const { onChange, ...rest } = props

  const throttleonChange = debounce(1000, (name: string, props: any) => {
    console.log(name)
    if (onChange) onChange(name, props)
  })

  const invalidColor = invalid && blur !== null ? 'red' : '#CACACA'
  const invalidColor2 = invalid && blur !== null ? 'red' : 'rgba(127,140,141,0.5)'

  return (
    <div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <style jsx>
          {`
            .react-tel-input {
              font-size: 14px;
              line-height: 1.3em;
              width: 100%;
            }
            .react-tel-input .form-control,
            input[type='tel'] {
              font-size: inherit;
              font-size: 14px;
              background-clip: padding-box;
              border-radius: 5px;
              display: block;
              height: 56px;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              padding: 0.7857142857em 0.9285714286em;
              padding-left: 100px;
              word-break: normal;
              line-height: inherit;
              padding-top: 1em;
              padding-bottom: 1em;
              width: 100%;

              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
                sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
            }

            .react-tel-input .form-control + div:before {
              font-size: 12px;
            }

            input[type='tel']:focus {
              outline: none;
            }
            .react-tel-input {
              border: 1px solid ${invalidColor} !important;
              border-radius: 6px;
            }

            .react-tel-input .form-control {
              border: 0px;
            }

            .react-tel-input .form-control:hover {
              //border-color: #333333;
            }

            .react-tel-input .form-control:focus {
              border-color: ${invalidColor2};
              box-shadow: 0 0 0 1px rgba(127, 140, 141, 0.1);
            }

            .react-tel-input .form-control:focus + div:before {
              color: #000000;
            }

            .react-tel-input .selected-flag .flag {
            }

            .react-tel-input .flag-dropdown {
              background-color: #f7f9fa;
              padding-left: 8px;
              padding-right: 26px;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }

            .react-tel-input .selected-flag .arrow {
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #555;
              margin: 0 9px 9px 13px;
            }

            .react-tel-input .flag {
              width: 24px;
              height: 24px;
              background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADB/VeXAAAEJElEQVRIDbVVa2gcVRT+7uzsI7ub3WyemEhqG2NiI6lJKFofQZRatTal0BQ1EX8ICkJA0Ag1VRItEbHGQkH84x9BxK2oW4pSG9oUmgbSGm2hkk02GiUNySbdx2x2srM7D8+dbaprtiFKPHDm3nPPPd+58825ZxhuJbv8xXC6WqxW7C332B69FlEqy71W9+mee7Gp1J6gsDnSIdKvBUEY83g812m+SoR/rhiGYfnizNTu6k2+Uw47Ao83+l45fOCOu7dWFXhhwMJgWCimiLSe9GXSgK7rP0Sj0TYeS3aOiDlW+1n3jxNz3RVF9tdlRXNqmoHWei+21xSi2G3FwvwSkp8FsGRTV8IYTQpIm5luHI+eu/T+OOo+qEeQv6EpfENWCNwlpj6tu825z2UXxNEpiaVVA1tvd0LJ6IjJBLoQwZfnjqFKjqxE5Y4GMvSGp0SonTX4Nc6dJkXt7X6LYCTfUFR9X0bTrOOzMlPp9FxmowrqKp2Iy5ppw6B17sqngJU8T2Zg7fEDJl0mRYt1lbscIem1ls2FYv+zm5FUdHR/PoXpcArvPbMFjzQUoferaQyelyHe3wirlswmy/MkSgQIQteOpheGMPDmd+KLAxeKzwSTfXJad16YjGM4GIfdKiA4KyNDFI1MSqA3w2goAaHIA9+Rd1BS6sgDfXOJ08439Cb6ui6x4s7BnUtpJUB8FwjkchA4pyejGyYbNqobG60tKxpKCq0YPLQN1WsnMDNRRS3TpEP85KUtbR+enHH8NJ1AGQHsaSnBTETByISEpZSGHXd5sKe5BB+fnoUkKchcDiLtWVXdJmjugzkgJXaL993peayx2skuTkng37XzoQqodPr9H12FTh/0qaYS7N1ehm8uLiL+exix59+FS47mYuW3GMG1ih3HfqkMxzMEBlxPpPGW/zc47RZIVDUqFY5/JIxvRxcQmk/lh1ljlUq2QpyYW3bzkiv38AoDrs7I5ljkyt7BPxYV0+aPUq8dYpkPwvJf1+emM8+EgbnY5dC8euP659mSuyQYOspSEkQa1yUG01gsFuOE8t6y4UKVJPFy4F3x/5KwGH2ue8iISXX0GdZH7DqPQmAG87iH2QRqd+pgAcLnXXEDxeCl0CFokMfo9OMbiGxCUR8YV5EeMWm5duhom7it9jgYs21IIt3IqFcm91cdfvWEmYD/iSRJepvGg5QgeyH+eybe1we8Xu9BxphmNhU+SafTR2j8npx8A+Xize7f6Y3YsxTXzzHJzq2cSCTi1UZ+7lHOj3UZqrZmT+bBfxcmWDL21uaj4gNN/T6fL7biMylaMfjI/0T3oPYJuua95GygJUrEVu3LxvDfG1K8SGh/3xUETx7IMpB10/MWgUAINeUaLA8aYE8TwMO8cdFmF48kO0kaJn6HyQzwamnAdN4L+yeJ6cqDl1AigwAAAABJRU5ErkJggg==') !important;
              background-repeat: no-repeat;
            }

            .react-tel-input .us {
              background-position: 0px 0px;
            }
          `}
        </style>
        <PhoneInput
          inputProps={{ ...rest }}
          country={'us'}
          onChange={(value, data: CountryData, event, formattedValue) => {
            setState({ ...state, value, data, formattedValue })

            const newState = {
              ...state,
              blur: false,
              focus: true,
            }
            const { dialCode = null, countryCode = '' } = data

            const areaCode = `en-${countryCode.toUpperCase()}`
            let invalid = true

            if (value.match(phones[areaCode])) {
              invalid = false
              setState({ ...newState, invalid })
            }

            setState({ ...newState, invalid })

            throttleonChange('tel', {
              invalid,
              blur: false,
              value,
              data,
              formattedValue,
            })
          }}
          onFocus={() => setState({ ...state, blur: false, focus: true })}
          dropdownStyle={{ backgroundColor: '#ebeff3', paddingLeft: 10, paddingRight: 26 }}
          specialLabel=""
          onBlur={() => setState({ ...state, blur: true, focus: false })}
        />
        <div style={{ position: 'relative', marginLeft: -40 }}>
          {props.success && !invalid && (
            <CheckMark color={!props.isNewUser ? '#00A4BC' : '#7C839B'} />
          )}
          {blur && invalid && <TimesIcon />}
        </div>
      </div>

      <p
        style={{
          fontFamily: 'Montserrat',
          fontSize: 13,
          fontWeight: 600,
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: 1.25,
          letterSpacing: 'normal',
          textAlign: 'left',
          color: blur && invalid ? '#FD1515' : '#FFF',
          marginTop: 5,
        }}
      >
        Wrong Format
      </p>
    </div>
  )
}

export default Input

// fixed the attachments issue for both qa and dev
// fixed tax juri field on update-global
//
