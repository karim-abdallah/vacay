import { Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useState } from "react";

function HolidayCheckbox(props) {
  return (
    <div>
      <input type="checkbox" id={props.holiday} name={props.holiday} />
      <label for={props.holiday}>{props.holiday}</label>
    </div>
  );
}

const HolidaysPane = () => {
  const availableHolidays = [
    "New Year's Day",
    "Labor Day",
    "Independence Day",
    "Martin Luther King Day",
    "Thanksgiving Day",
    "Juneteenth",
    "Memorial Day",
    "Christmas Day",
    "Veterans Day",
  ];

  const holidayCheckboxes = availableHolidays.map((item, index) => {
    return <HolidayCheckbox holiday={item} />;
  });

  return (
    <PaneContainer>
      <SettingsSubheader>Holidays</SettingsSubheader>
      <HolidaysContainer>
        {holidayCheckboxes}
        <button>Add Holiday</button>
      </HolidaysContainer>
    </PaneContainer>
  );
};

const OptionsPane = () => {
  return (
    <PaneContainer>
      <SettingsSubheader>Options</SettingsSubheader>
      <OptionsContainer>
        <div>Days</div>
        <div>Vacation Time</div>
        <div>Personnal Time (PTO)</div>
        <div>Annual Allowance</div>
        <input type="number" />
        <input type="number" />
        <div>Annual Cap</div>
        <input type="number" />
        <input type="number" />
        <div>Current Balance (September)</div>
        <input type="number" />
        <input type="number" />
      </OptionsContainer>
    </PaneContainer>
  );
};

const TimeOffSettings = () => {
  const [expandedSettings, setExpandedSettings] = useState(false);

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
                <HolidaysPane />
                <OptionsPane />
              </SettingsContainer>
            </TimeOffSettingsContainer>
          </CardBody>
        </Card>
      )}
    </>
  );
};

const PaneContainer = styled.div`
  display: grid;
`;

const HolidaysContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

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
