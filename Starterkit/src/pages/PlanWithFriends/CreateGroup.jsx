import styled from 'styled-components';

export const CreateGroup = () => {
  return <CreateGroupButton>+ Create group</CreateGroupButton>;
};

const CreateGroupButton = styled.button`
  border-radius: 13px;
  border-width: 0px;
  background-color: #36438c;
  color: white;
  width: 220px;
  height: 40px;
  margin-top: 10px;
  margin-left: 20px;
`;
