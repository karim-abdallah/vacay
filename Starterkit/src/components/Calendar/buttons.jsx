import styled from "styled-components";

const ActionButton = styled.button`
  padding: 2% 0px;
  margin-bottom: 10px;
  color: #ffffff;
  border-radius: 25px;
  border-width: 0px;
  width: 45%;
`;

export const StyledBookButton = styled(ActionButton)`
  background-color: #6a48ff;
`;

export const StyledUnbookButton = styled(ActionButton)`
  background-color: #6d7994;
`;

export const StyledConfirmBookingButton = styled(ActionButton)`
  background-color: #6a48ff;
`;

export const StyledCancelBookingButton = styled(ActionButton)`
  background-color: #c2b2fc;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 7%;
`;

export const StyledCancelUnbookButton = styled(ActionButton)`
  background-color: rgba(109, 121, 148, 0.25);
  color: rgba(255, 255, 255, 0.7);
  margin-left: 7%;
`;
