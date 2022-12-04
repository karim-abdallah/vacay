import { Card, CardBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getPTOSettings } from "../../store/dashboard/selector";
import { minSettingsValueDays, maxSettingsValueDays } from "../../constants";

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

function NumberOptionDays(props) {
  return (
    <StyledFormItem name={props.name}>
      <InputNumber
        size="small"
        min={minSettingsValueDays}
        max={maxSettingsValueDays}
      />
    </StyledFormItem>
  );
}

const OptionPaneWithForm = () => {
  const dispatch = useDispatch();
  const settings = useSelector(getPTOSettings);

  const fields = [
    {
      name: "vacationAllowance",
      value: settings.vacationSettings.annualAllowanceDays,
    },
    { name: "ptoAllowance", value: settings.PTOSettings.annualAllowanceDays },
    { name: "vacationCap", value: settings.vacationSettings.accrualCapDays },
    { name: "ptoCap", value: settings.PTOSettings.accrualCapDays },
    {
      name: "vacationBalance",
      value: settings.vacationSettings.currentBalanceDays,
    },
    { name: "ptoBalance", value: settings.PTOSettings.currentBalanceDays },
  ];

  const updateSettingsHandler = (_, allValues) => {
    dispatch({ type: "settings/update", payload: allValues });
  };

  return (
    <PaneContainer>
      <SettingsSubheader>Options</SettingsSubheader>
      <Form
        name="PTO Settings"
        fields={fields}
        onValuesChange={updateSettingsHandler}
      >
        <OptionsContainer>
          <div>Days</div>
          <div>Vacation Time</div>
          <div>Personnal Time (PTO)</div>
          <div>Annual Allowance</div>
          <NumberOptionDays name="vacationAllowance" />
          <NumberOptionDays name="ptoAllowance" />
          <div>Annual Cap</div>
          <NumberOptionDays name="vacationCap" />
          <NumberOptionDays name="ptoCap" />
          <div>Current Balance ({settings.currentMonth.split(" ")[0]})</div>
          <NumberOptionDays name="vacationBalance" />
          <NumberOptionDays name="ptoBalance" />
        </OptionsContainer>
      </Form>
    </PaneContainer>
  );
};

const TimeOffSettings = () => {
  const [expandedSettings, setExpandedSettings] = useState(false);

  const handleExpandSettings = () => {
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
                <OptionPaneWithForm />
              </SettingsContainer>
            </TimeOffSettingsContainer>
          </CardBody>
        </Card>
      )}
    </>
  );
};

const StyledFormItem = styled(Form.Item)`
  margin: 0px;
  height: 32px;
`;

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
