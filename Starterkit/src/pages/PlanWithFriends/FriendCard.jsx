import { Card, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { lightBlue } from '../../styles/constants';
import Picture from '../../assets/images/profile.png';

export const FriendCard = ({ name, profilePic }) => {
  // TODO: integrate with back-end and S3 to pull info
  /*   const profilePic = pierreProfilePic;
   */
  return (
    <StyledCard>
      <StyledCardBody>
        {' '}
        <StyledImage src={profilePic ? profilePic : Picture} alt="" />
        {name}
      </StyledCardBody>
    </StyledCard>
  );
};

const StyledImage = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  margin-right: 10px;
`;

const StyledCardBody = styled(CardBody)`
  display: flex;
  padding: 10px;
`;

const StyledCard = styled(Card)`
  border-radius: 25px;
  text-align: left;
  margin: 15px 15px 0px;
  height: 40px;
  width: 100%;
  background-color: ${lightBlue};
`;
