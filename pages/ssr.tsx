import { Basic, Combined, Pink } from "../shared/styles";

export const getServerSideProps = async () => ({ props: {} });

const Ssr = () => (
  <div>
    <Basic>SSR page: Cool Styles</Basic>
    <Pink>Pink text</Pink>
    <Combined>
      With <code>:hover</code>.
    </Combined>
  </div>
);

export default Ssr;
