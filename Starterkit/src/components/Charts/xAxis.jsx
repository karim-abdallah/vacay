import styled from "styled-components";
import { monthYearFormatter } from "../../helpers/vacay_helpers";

export const XAxis = props => {
  console.log(props.months);
  const monthYears = props.months.map(x => monthYearFormatter(x));
  console.log(monthYears);
  const xAxis = monthYears.map(name => <StyledMonthBox>{name}</StyledMonthBox>);

  return <StyledAxisContainer>{xAxis}</StyledAxisContainer>;
};

const StyledMonthBox = styled.div`
  word-wrap: break-word;
  width: calc(100% / 12);
`;

const StyledAxisContainer = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export default XAxis;
