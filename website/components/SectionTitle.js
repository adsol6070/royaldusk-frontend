import { Fragment } from "react";
import Counter from "./Counter";
const SectionTitle = ({
  title,
  // countValue = 34500,
  // subtitle1 = "Explore",
  subtitle2 = "Explore breathtaking destinations and vibrant cultures in the world's top cities!",
  bg,
}) => {
  return (
    <Fragment>
      <h2>{title}</h2>
      <p>
        {/* {subtitle1}{" "}
        <span className={`count-text plus ${bg}`}>
          <Counter end={countValue} />
        </span>{" "} */}
        {subtitle2}
      </p>
    </Fragment>
  );
};
export default SectionTitle;
