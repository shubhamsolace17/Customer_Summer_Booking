import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Email(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100.354 100.352"
      {...props}>
      <Path
        fill={themeConfig.colors.black}
        d="M93.09 76.224c.047-.145.079-.298.079-.459V22.638c0-.162-.032-.316-.08-.462-.007-.02-.011-.04-.019-.06a1.492 1.492 0 00-.276-.46c-.008-.009-.009-.02-.017-.029-.005-.005-.011-.007-.016-.012a1.504 1.504 0 00-.442-.323c-.013-.006-.023-.014-.036-.02a1.48 1.48 0 00-.511-.123c-.018-.001-.035-.005-.053-.005-.017-.001-.032-.005-.049-.005H8.465c-.017 0-.033.004-.05.005l-.048.005a1.497 1.497 0 00-.518.125c-.01.004-.018.011-.028.015-.17.081-.321.191-.448.327-.005.005-.011.006-.016.011-.008.008-.009.019-.017.028a1.5 1.5 0 00-.277.461c-.008.02-.012.04-.019.061-.048.146-.08.3-.08.462v53.128c0 .164.033.32.082.468l.018.059a1.5 1.5 0 00.28.462c.007.008.009.018.016.026.006.007.014.011.021.018.049.051.103.096.159.14.025.019.047.042.073.06.066.046.137.083.21.117.018.008.034.021.052.028.181.077.38.121.589.121h83.204c.209 0 .408-.043.589-.121.028-.012.054-.03.081-.044.062-.031.124-.063.181-.102.03-.021.057-.048.086-.071.051-.041.101-.082.145-.129l.025-.022c.008-.009.01-.021.018-.03a1.5 1.5 0 00.275-.458c.01-.022.015-.043.022-.065zM9.965 26.04l25.247 23.061L9.965 72.346V26.04zm51.746 21.931c-.104.068-.214.125-.301.221-.033.036-.044.083-.073.121l-11.27 10.294-37.736-34.469h75.472L61.711 47.971zm-24.275 3.161l11.619 10.613a1.496 1.496 0 002.023 0l11.475-10.481 25.243 23.002H12.309l25.127-23.134zm27.342-1.9L90.169 26.04v46.33L64.778 49.232z"
      />
    </Svg>
  );
}

export default Email;