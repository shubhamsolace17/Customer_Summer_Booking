import * as React from 'react';
import Svg, {Defs, Path, ClipPath, Use} from 'react-native-svg';

function Heart(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      {...props}>
      <Defs>
        <Path id="prefix__a" d="M0 0h512v512H0z" />
      </Defs>
      <ClipPath id="prefix__b">
        <Use xlinkHref="#prefix__a" overflow="visible" />
      </ClipPath>
      <Path
        d="M141 71.25c-55 0-100 45-100 100 0 73 46 121 213 258 167-137 213-185 213-258 0-55-45-100-100-100-50 0-77 30-98 54l-15 17-15-17c-21-24-48-54-98-54zm113 392l-8-7c-182-148-231-200-231-285 0-70 57-126 126-126 58 0 91 33 113 58 22-25 55-58 113-58 70 0 126 57 126 126 0 85-49 137-231 285l-8 7z"
        clipPath="url(#prefix__b)"
        fill="#243b7c"
      />
    </Svg>
  );
}

export default Heart;
