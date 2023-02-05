import { Card, CardBody } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber, Checkbox, Tooltip } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getPTOSettings, getHolidays } from "../../store/dashboard/selector";
import { tooltipBackground } from "../../styles/constants";
import { minSettingsValueDays, maxSettingsValueDays } from "../../constants";
import { TimeOffSettingsInstructions } from "./instructionText";
import minimize from "../../assets/images/minimize.png";
import settings from "../../assets/images/settings.png";

function HolidayCheckbox(props) {
  return (
    <CheckboxLabel value={props.holiday.name}>
      <Tooltip
        color={tooltipBackground}
        title={props.holiday.date.toLocaleDateString()}
      >
        {props.holiday.name}
      </Tooltip>
    </CheckboxLabel>
  );
}

const HolidaysPane = () => {
  const dispatch = useDispatch();
  const holidays = useSelector(getHolidays);

  const sortedHolidays = holidays.sort((a, b) => a.date - b.date);

  const holidayCheckboxes = sortedHolidays.map((item, index) => {
    return <HolidayCheckbox holiday={item} />;
  });

  const checkboxHandler = checkedValues => {
    dispatch({ type: "holidays/update", payload: checkedValues });
  };

  return (
    <HolidayPaneContainer>
      <SettingsSubheader>Public holidays</SettingsSubheader>
      <HolidaysContainer
        defaultValue={sortedHolidays.filter(x => x.active).map(x => x.name)}
        onChange={checkboxHandler}
      >
        {holidayCheckboxes}
      </HolidaysContainer>
    </HolidayPaneContainer>
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
    { name: "ptoAllowance", value: settings.PTOSettings.annualAllowanceDays },
    { name: "ptoBalance", value: settings.PTOSettings.currentBalanceDays }
  ];

  const updateSettingsHandler = (_, allValues) => {
    dispatch({ type: "settings/update", payload: allValues });
  };

  return (
    <OptionsPaneContainer>
      <SettingsSubheader>
        Your settings{" "}
        <StyledInfoTooltip
          title={TimeOffSettingsInstructions()}
          arrowPointAtCenter
          placement="bottomLeft"
          trigger="click"
          color={tooltipBackground}
        >
          ?
        </StyledInfoTooltip>
      </SettingsSubheader>
      <Form
        name="PTO Settings"
        fields={fields}
        onValuesChange={updateSettingsHandler}
      >
        <OptionsContainer>
          <div></div>
          <div>Time off (Days)</div>
          <div>Annual allowance</div>
          <NumberOptionDays name="ptoAllowance" />
          <div>Your current balance</div>
          <NumberOptionDays name="ptoBalance" />
        </OptionsContainer>
      </Form>
    </OptionsPaneContainer>
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
          <ExpandedTimeOffSettingsCard>
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
              <p>Enter your time-off options and select your holidays.</p>
              <SettingsContainer>
                <OptionPaneWithForm />
                <HolidaysPane />
              </SettingsContainer>
            </TimeOffSettingsContainer>
          </ExpandedTimeOffSettingsCard>
        </Card>
      )}
    </>
  );
};

const ExpandedTimeOffSettingsCard = styled(CardBody)`
  padding: 10px;
`;

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

const OptionsPaneContainer = styled.div`
  display: inline-grid;
  grid-template-rows: 30px 30px;
`;

const HolidayPaneContainer = styled.div`
  display: grid;
  grid-template-rows: 30px;
`;

const CheckboxLabel = styled(Checkbox)`
  font-weight: normal;
`;

const HolidaysContainer = styled(Checkbox.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 30px;
  align-items: center;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 30px 30px 30px 30px;
  align-items: center;
`;

const SettingsSubheader = styled.div`
  color: #2b3674;
  font-weight: bold;
  font-size: 18px;
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
  position: relative;
  bottom: 8px;
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
  color: #2b3674;
  float: left;
  text-align: left;
  font-size: 20px;
  font-weight: 900;
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
`;

const StyledInfoTooltip = styled(Tooltip)`
  cursor: pointer;
  border: 1px solid;
  border-color: ${tooltipBackground};
  border-radius: 50%;
  font-size: 10px;
  padding-right: 5px;
  padding-left: 5px;
  position: relative;
  bottom: 2px;
`;

export default TimeOffSettings;
