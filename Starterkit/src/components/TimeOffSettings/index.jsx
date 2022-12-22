import { Card, CardBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber, Checkbox } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getPTOSettings, getHolidays } from "../../store/dashboard/selector";
import { minSettingsValueDays, maxSettingsValueDays } from "../../constants";

function HolidayCheckbox(props) {
  return <Checkbox value={props.holiday}>{props.holiday}</Checkbox>;
}

const HolidaysPane = () => {
  const dispatch = useDispatch();
  const holidays = useSelector(getHolidays);

  const holidayCheckboxes = holidays.map((item, index) => {
    return <HolidayCheckbox holiday={item.name} />;
  });

  const checkboxHandler = (checkedValues) => {
    dispatch({ type: "holidays/update", payload: checkedValues });
  };

  return (
    <PaneContainer>
      <SettingsSubheader>Holidays</SettingsSubheader>
      <HolidaysContainer
        defaultValue={holidays.filter((x) => x.active).map((x) => x.name)}
        onChange={checkboxHandler}
      >
        {holidayCheckboxes}
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
  const [expandedSettings, setExpandedSettings] = useState(true);

  const handleExpandSettings = () => {
    setExpandedSettings(!expandedSettings);
  };

  return (
    <>
      {!expandedSettings ? (
            <TimeOffSettingsButton onClick={handleExpandSettings}>Time Off Settings</TimeOffSettingsButton>
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

const HolidaysContainer = styled(Checkbox.Group)`
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

const TimeOffSettingsButton = styled.button`
float: right;
background-color: #FFFFFF;
height: 40px;
width: 200px;
border-width: 0px;
border-radius: 13px;
`;

const MinimizeButton = styled.button`
  float: right;
  font-size: 15px;
  text-align: right;
  border-radius: 10px;
padding-top: 3px;
padding-bottom: 3px;
padding-right: 15px;
padding-left: 15px;
border-width: 0px;
background-color: #F4F7FE;
color: #2B3674;
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
