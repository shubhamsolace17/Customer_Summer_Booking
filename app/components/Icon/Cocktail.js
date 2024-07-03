import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function Cocktail(props) {
  return (
    <Svg
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      viewBox="0 0 48 48"
      xmlSpace="preserve"
      {...props}>
      <G id="prefix__Expanded">
        <Path
          fill="#4e4e4e"
          className="prefix__st0"
          d="M25 30c-.26 0-.51-.1-.71-.29l-16-16c-.29-.29-.37-.72-.22-1.09.16-.38.53-.62.93-.62h32c.4 0 .77.24.92.62.15.37.07.8-.22 1.09l-16 16c-.19.19-.44.29-.7.29zM11.41 14L25 27.59 38.59 14H11.41z"
        />
        <Path
          fill="#4e4e4e"
          className="prefix__st0"
          d="M25 48c-.55 0-1-.45-1-1V29c0-.55.45-1 1-1s1 .45 1 1v18c0 .55-.45 1-1 1z"
        />
        <Path
          fill="#4e4e4e"
          className="prefix__st0"
          d="M33 48H17c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1zM14.29 13.71L9.05 8.47C8.11 7.52 6.85 7 5.51 7H0V5h5.51c1.87 0 3.63.73 4.95 2.05l5.24 5.24-1.41 1.42zM41 18c-1.29 0-2.55-.35-3.65-1.02l1.04-1.71c.79.48 1.69.73 2.61.73 2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5c0 .57.1 1.13.28 1.66l-1.88.67c-.27-.75-.4-1.53-.4-2.33 0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7z"
        />
      </G>
    </Svg>
  );
}

export default Cocktail;
