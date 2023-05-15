import { Card, CardBody, Container } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber, Checkbox, Tooltip, Input,Button,Image } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getPTOSettings, getHolidays } from "../../store/dashboard/selector";
import { tooltipBackground, cardHoverColor } from "../../styles/constants";
import { minSettingsValueDays, maxSettingsValueDays } from "../../constants";
import { TimeOffSettingsInstructions } from "./instructionText";
import minimize from "../../assets/images/minimize.png";
import plus from "../../assets/images/plus1.svg";
import settings from "../../assets/images/settings.png";
import { put, get } from "../../helpers/api_helper";

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

function AddHolidayButton() {
  
  return (
    <AddHolidayContainer>
      <CustomAddHolidayImage  src={plus}
    />
        <CustomAddHolidayInput placeholder="MM/DD |Holiday Name"/>
    </AddHolidayContainer>
  );
}

const HolidaysPane = () => {
  const fetchHoliday = async () => {
    let data = await get("/dashboard/holidays");
  };

  useEffect(() => {
    setTimeout(() => {
      fetchHoliday();
    }, 500);
  }, []);

  const dispatch = useDispatch();
  const holidays = useSelector(getHolidays);

  const sortedHolidays = holidays.sort((a, b) => a.date - b.date);

  const holidayCheckboxes = sortedHolidays.map((item, index) => {
    return <HolidayCheckbox holiday={item} />;
  });

  const checkboxHandler = (checkedValues) => {
    dispatch({ type: "holidays/update", payload: checkedValues });
  };
  return (
    <HolidayPaneContainer>
      <SettingsSubheader>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Public holidays </span>
          <span>United States</span>
        </div>
      </SettingsSubheader>
      <HolidaysContainer
        defaultValue={sortedHolidays.filter((x) => x.active).map((x) => x.name)}
        onChange={checkboxHandler}
      >
        {holidayCheckboxes}
        <AddHolidayButton />
      </HolidaysContainer>
    </HolidayPaneContainer>
  );
};

function NumberOptionDays(props) {

  return (
    <StyledFormItem name={props.name} className="text-end">
      <InputNumber
        size="small"
        min={minSettingsValueDays}
        max={maxSettingsValueDays}
        onChange={props.onChange}
      />
    </StyledFormItem>
  );
}

const OptionPaneWithForm = () => {
  const dispatch = useDispatch();

  const settings = useSelector(getPTOSettings);
  const fields = [
    { name: "ptoAllowance", value: settings.PTOSettings.annualAllowanceDays },
    { name: "ptoCap", value: settings.PTOSettings.accrualCapDays },
    { name: "ptoBalance", value: settings.PTOSettings.currentBalanceDays },
  ];

  const updateSettings = async (allValues) => {
    const payload = {
      annual_allowance_days: allValues.ptoAllowance,
      current_balance_days: allValues.ptoBalance,
    };
    await put("/dashboard/time-off-settings", payload);
  };

  const updateSettingsHandler = (_, allValues) => {
    updateSettings(allValues);
    dispatch({ type: "settings/update", payload: allValues });
  };
  return (
    <OptionsPaneContainer>
      <SettingsSubheader>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            Time Off Policy{" "}
            <StyledInfoTooltip
              title={TimeOffSettingsInstructions()}
              arrow
              placement="bottomLeft"
              trigger="click"
              color={tooltipBackground}
            >
              i
            </StyledInfoTooltip>
          </span>
          <span style={{ textTransform: "capitalize" }}>
            {settings.PTOSettings.accrualType}
          </span>
        </div>
      </SettingsSubheader>
      <Form
        name="PTO Settings"
        fields={fields}
        onValuesChange={updateSettingsHandler}
      >
        <OptionsContainer>
          <div>Annual allowance</div>
          <NumberOptionDays name="ptoAllowance" />
          <div>Annual Cap</div>
          <NumberOptionDays name="ptoCap" />
          <div>Current Balance</div>
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
        <div>
          <TimeOffSettingsButton onClick={handleExpandSettings}>
            <SmallTimeOffSettingsIcon src={settings} />
          </TimeOffSettingsButton>
        </div>
      ) : (
        <Card>
          <ExpandedTimeOffSettingsCard>
            <TimeOffSettingsContainer>
              <div>
                <TimeOffSettingsHeader>
                  Time Off Settings <SmallTimeOffSettingsIcon src={settings} />
                </TimeOffSettingsHeader>

                <MinimizeButton onClick={handleExpandSettings}>
                  Minimize{" "}
                  <StyledMinimizeIcon src={minimize} alt="x" height="15" />
                </MinimizeButton>
                <SaveChangesButton>Save Changes</SaveChangesButton>
              </div>
              <br />
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
  font-size: 13px;
  .ant-checkbox-inner {
    background-color: #f4f7fe;
    border:none;
  }
  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #2b3674;
  }
`;

const HolidaysContainer = styled(Checkbox.Group)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 30px;
  align-items: center;
  overflow-y: scroll;
  height: 15vh;
  font-size: 5px !important;
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
  width: 40px;
  text-align: center;
  border-width: 0px;
  border-radius: 13px;
  position: relative;
  bottom: 8px;
  &:hover {
    background-color: ${(props) => !props.showpointer && cardHoverColor};
  }
`;

const SaveChangesButton = styled.button`
  float: right;
  font-size: 15px;
  text-align: right;
  border-radius: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
  margin-right: 5px;
  padding-left: 15px;
  border-width: 0px;
  background-color: #f4f7fe;
  color: #2b3674;
`;

const AddHolidayContainer = styled.div`
display: flex;
background-color: #f4f7fe;
border-radius: 15px;
`;


const CustomAddHolidayInput = styled(Input)`
  border: none;
  background-color: transparent;
  border-radius: 15px;
  .ant-input:hover,
  .ant-input:focus {
    border-color:none !important;
    box-shadow: none !important;
    border: none !important;
    box-sizing:unset !important;
    outline: none !important;
  }
`;

const CustomAddHolidayImage = styled.img`
margin: 0px 13px;
cursor: pointer;
`

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
  grid-template-columns: 1fr 2fr;
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
