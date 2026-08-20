import {config, library} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import {
    faGithub
} from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;

library.add(
    faGithub
);

export default function MyApp({Component, pageProps}: any) {
    return <Component {...pageProps} />
}
