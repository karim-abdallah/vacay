import { Card, CardBody } from "reactstrap";
import styled from "styled-components";

const TimeOffSettings = () => {
  return (
    <Card>
      <CardBody>
        <TimeOffSettingsContainer>
          <div>
            <TimeOffSettingsHeader>Time Off Settings</TimeOffSettingsHeader>
            <MinimizeButton>Minimize</MinimizeButton>
          </div>
          <SettingsContainer>
            <SettingsSubheader>Holidays</SettingsSubheader>
            <SettingsSubheader>Options</SettingsSubheader>
          </SettingsContainer>
        </TimeOffSettingsContainer>
      </CardBody>
    </Card>
  );
};

const SettingsSubheader = styled.div`
  font-size: 16px;
  border-bottom: solid;
`;

const MinimizeButton = styled.button`
  float: right;
  font-size: 14px;
  text-align: right;
`;

const TimeOffSettingsContainer = styled.div`
  display: grid;
`;

const TimeOffSettingsHeader = styled.div`
  float: left;
  text-align: left;
  font-size: 20px;
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
`;

export default TimeOffSettings;
