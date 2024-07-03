import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function Location({color = 'yellow', ...props}) {
  const fill = themeConfig.colors[color];
  return (
    // <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    //   <Path
    //     fill={fill}
    //     d="M256 0C161.896 0 85.333 76.563 85.333 170.667c0 28.25 7.063 56.26 20.49 81.104L246.667 506.5c1.875 3.396 5.448 5.5 9.333 5.5s7.458-2.104 9.333-5.5l140.896-254.813c13.375-24.76 20.438-52.771 20.438-81.021C426.667 76.563 350.104 0 256 0zm0 256c-47.052 0-85.333-38.281-85.333-85.333S208.948 85.334 256 85.334s85.333 38.281 85.333 85.333S303.052 256 256 256z"
    //   />
    // </Svg>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="location-2955"
      width="12.601"
      height="18.049"
      viewBox="0 0 12.601 18.049">
      <G id="Group_1" data-name="Group 1">
        <Path
          id="Subtraction_2"
          data-name="Subtraction 2"
          d="M6.3,18.049a.8.8,0,0,1-.691-.394L4.73,16.167c-1.8-3.051-3.51-5.933-4.094-7.1A6.3,6.3,0,1,1,12.6,6.3a6.246,6.246,0,0,1-.633,2.756l-.015.029v0c-.6,1.189-2.289,4.051-4.081,7.08h0l-.879,1.487a.8.8,0,0,1-.691.394ZM6.3,3A3.082,3.082,0,1,0,9.382,6.079,3.086,3.086,0,0,0,6.3,3Z"
          fill={props.color ? props.color : '#5873ba'}
        />
      </G>
    </Svg>
  );
}

export default Location;
