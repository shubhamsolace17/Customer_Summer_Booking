import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Call(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <Path d="M0 0h48v48H0V0z" fill="none" />
      <Path
        d="M13.3 21.6c2.9 5.7 7.5 10.3 13.2 13.2l4.4-4.4c.5-.5 1.3-.7 2-.5 2.2.7 4.6 1.1 7.1 1.1 1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2C21.2 42 6 26.8 6 8c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2 0 2.5.4 4.9 1.1 7.1.2.7.1 1.5-.5 2l-4.3 4.5z"
        fill="#4e4e4e"
      />
    </Svg>
  );
}

export default Call;
