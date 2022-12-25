import { Card, CardBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber, Checkbox } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getPTOSettings, getHolidays } from "../../store/dashboard/selector";
import { minSettingsValueDays, maxSettingsValueDays } from "../../constants";
import minimize from "../../assets/images/minimize.png";
import settings from "../../assets/images/settings.png";

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
          <div>Personnal Time (PTO)</div>
          <div>Annual Allowance</div>
          <NumberOptionDays name="ptoAllowance" />
          <div>Annual Cap</div>
          <NumberOptionDays name="ptoCap" />
          <div>Current Balance ({settings.currentMonth.split(" ")[0]})</div>
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
        <TimeOffSettingsButton onClick={handleExpandSettings}>
          Time Off Settings <SmallTimeOffSettingsIcon src={settings} />
        </TimeOffSettingsButton>
      ) : (
        <Card>
          <CardBody>
            <TimeOffSettingsContainer>
              <div>
                <TimeOffSettingsHeader>
                  Time Off Settings
                  <SmallTimeOffSettingsIcon src={settings} />
                </TimeOffSettingsHeader>
                <MinimizeButton onClick={handleExpandSettings}>
                  Minimize{" "}
                  <StyledMinimizeIcon src={minimize} alt="x" height="15" />
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

const SmallTimeOffSettingsIcon = styled.img`
  height: 20px;
  padding-left: 10px;
`;

const StyledMinimizeIcon = styled.img`
  height: 12px;
  padding-left: 5px;
`;

const StyledFormItem = styled(Form.Item)`
  margin: 0px;
  height: 32px;
`;

const PaneContainer = styled.div`
  display: inline-grid;
  grid-template-rows: 45px;
`;

const HolidaysContainer = styled(Checkbox.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const SettingsSubheader = styled.p`
  font-size: 16px;
  border-bottom: solid;
`;

const TimeOffSettingsButton = styled.button`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  float: right;
  background-color: #ffffff;
  height: 40px;
  width: 180px;
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
  background-color: #f4f7fe;
  color: #2b3674;
`;

const TimeOffSettingsContainer = styled.div`
  display: grid;
`;

const TimeOffSettingsHeader = styled.div`
  float: left;
  text-align: left;
  font-size: 18px;
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
`;

export default TimeOffSettings;
