import styled from 'styled-components';
import { axisColor } from '../../styles/constants';
import { xAxisMonthYearFormatter } from '../../helpers/vacay_helpers';

export const XAxis = props => {
  const monthYears = props.months.map(x => xAxisMonthYearFormatter(x));
  const xAxis = monthYears.map(name => <StyledMonthBox>{name}</StyledMonthBox>);

  return <StyledAxisContainer>{xAxis}</StyledAxisContainer>;
};

const StyledMonthBox = styled.div`
  word-wrap: break-word;
  width: calc(100% / 12);
  text-align: center;
  border-right: 1px solid ${axisColor};

  &:last-child {
    border-right: none;
  }
`;

const StyledAxisContainer = styled.div`
  margin-top: 8px;
  margin-left: 30px;
  display: flex;
  justify-content: space-between;
`;

export default XAxis;
