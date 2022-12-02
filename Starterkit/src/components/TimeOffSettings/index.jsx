import { Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useState } from "react";

const TimeOffSettings = () => {
  const [expandedSettings, setExpandedSettings] = useState(true);

  const handleExpandSettings = () => {
    console.log("Expand Settings");
    setExpandedSettings(!expandedSettings);
  };

  return (
    <>
      {!expandedSettings ? (
        <ExpandSettingsCard>
          <CardBody>
            <button onClick={handleExpandSettings}>Time Off Settings</button>
          </CardBody>
        </ExpandSettingsCard>
      ) : (
        <Card>
          <CardBody>
            <TimeOffSettingsContainer>
              <div>
                <TimeOffSettingsHeader>Time Off Settings</TimeOffSettingsHeader>
                <MinimizeButton onClick={handleExpandSettings}>
                  Minimize
                </MinimizeButton>
              </div>
              <SettingsContainer>
                <SettingsSubheader>Holidays</SettingsSubheader>
                <SettingsSubheader>Options</SettingsSubheader>
              </SettingsContainer>
            </TimeOffSettingsContainer>
          </CardBody>
        </Card>
      )}
    </>
  );
};

const ExpandSettingsCard = styled(Card)`
  text-align: right;
  //  float: right;
`;

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
