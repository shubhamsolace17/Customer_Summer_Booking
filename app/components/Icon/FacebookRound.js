import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="47"
      height="47"
      viewBox="0 0 47 47">
      <Path
        id="Subtraction_5"
        data-name="Subtraction 5"
        d="M23.5,47A23.5,23.5,0,0,1,6.883,6.883,23.5,23.5,0,0,1,40.117,40.117,23.35,23.35,0,0,1,23.5,47ZM20.709,24.666V36.611h4.828V24.666h4.017l.617-4.674H25.537v-2.98c0-1.363.394-2.271,2.314-2.271H30.3V10.57a32.559,32.559,0,0,0-3.485-.186h-.112c-3.7,0-6,2.361-6,6.162v3.44H16.7v4.678Z"
        fill="#233c7e"
      />
    </Svg>
  );
}

export default SvgComponent;
