import Home_V3 from "./(home)/home-v3/page";
import Wrapper from "./layout-wrapper/wrapper";

export const metadata = {
  title: "Home v1 || Homez - Real Estate NextJS Template",
};

export default function MainRoot() {
  return (
    <Wrapper>
      <Home_V3 />
    </Wrapper>
  );
}
