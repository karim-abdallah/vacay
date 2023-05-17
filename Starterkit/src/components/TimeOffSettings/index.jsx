import { Card, CardBody, Container } from "reactstrap";
import { useDispatch } from "react-redux";
import { Form, InputNumber, Checkbox, Tooltip, Input, Typography } from "antd";
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
  const [openInput, setOpenInput] = useState(false);
  const handletoggleInput = () => {
    setOpenInput(!openInput);
  };
  return (
    <AddHolidayContainer>
      <CustomAddHolidayImage src={plus} onClick={handletoggleInput} />

      {openInput && (
        <CustomAddHolidayInput
          size="small"
          onPressEnter={handletoggleInput}
          placeholder="MM/DD |Holiday Name"
        />
      )}
      {!openInput && (
        <CustomAddHolidayButton
          type="text"
          onClick={handletoggleInput}
          level={5}
        >
          Add Holiday
        </CustomAddHolidayButton>
      )}
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
  const settings = useSelector(getPTOSettings);
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
          <span>
            Public Holidays{" "}
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
          <span style={{ fontSize: "16px" }}>
            {settings.PTOSettings.country}
          </span>
        </div>
      </SettingsSubheader>
      <HolidaysContainer
        defaultValue={sortedHolidays.filter((x) => x.active).map((x) => x.name)}
        onChange={checkboxHandler}
      >
        {holidayCheckboxes}
        <div style={{ gridColumn: "span 2" }}>
          {" "}
          <AddHolidayButton />
        </div>
      </HolidaysContainer>
    </HolidayPaneContainer>
  );
};

function NumberOptionDays(props) {
 
  const handleChange = (value) => {
    
    if (value !== null) {
      console.log("activeme");
      props.onChangeStatus("active"); // Update status to "active" when input changes
    }
  };
  return (
    <StyledFormItem name={props.name} className="text-end">
      <InputNumber
        size="small"
        min={minSettingsValueDays}
        max={maxSettingsValueDays}
        // onChange={props.onChange}
        onChange={handleChange}
      />
    </StyledFormItem>
  );
}

const OptionPaneWithForm = ({ onChangeStatus }) => {
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
          <span style={{ textTransform: "capitalize", fontSize: "16px" }}>
            {settings.PTOSettings.accrualType}
          </span>
        </div>
      </SettingsSubheader>
      {settings.PTOSettings.accrualType == "unlimited" ? (
        <>
          <UnlimitedContainer>
            <p>
              Since you have opted for the Unlimited time off policy, we will
              hide your balance in the dashboard below.
            </p>
          </UnlimitedContainer>
        </>
      ) : (
        <>
          <Form
            name="PTO Settings"
            fields={fields}
            onValuesChange={updateSettingsHandler}
          >
            <OptionsContainer>
              <div>Annual Allowance</div>
              <NumberOptionDays name="ptoAllowance" onChangeStatus={onChangeStatus}/>
              <div>Annual Cap</div>
              <NumberOptionDays name="ptoCap" onChangeStatus={onChangeStatus}/>
              <div>Current Balance</div>
              <NumberOptionDays name="ptoBalance" onChangeStatus={onChangeStatus}/>
            </OptionsContainer>
          </Form>
        </>
      )}
    </OptionsPaneContainer>
  );
};

const TimeOffSettings = () => {
  const [status, setStatus] = useState("inactive");
  const [expandedSettings, setExpandedSettings] = useState(true);
  
  const handleSaveChanges = () => {
    if (status === "active") {
      setStatus("completed");
    }
  };
  const handleExpandSettings = () => {
    setExpandedSettings(!expandedSettings);
  };

  // status = 'inactive|active|completed'

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
                  Settings <SmallTimeOffSettingsIcon src={settings} />
                </TimeOffSettingsHeader>

                <MinimizeButton onClick={handleExpandSettings}>
                  Minimize{" "}
                  <StyledMinimizeIcon src={minimize} alt="x" height="15" />
                </MinimizeButton>
                {status === "active" && (
                  <SaveChangesActiveButton  onClick={handleSaveChanges}>
                    Save Changes
                  </SaveChangesActiveButton>
                )}

                {status === "inactive" && (
                  <SaveChangesInactiveButton  onClick={handleSaveChanges}>
                    Save Changes
                  </SaveChangesInactiveButton>
                )}

                {status === "completed" && (
                  <ChangesSavedText>Changes saved!</ChangesSavedText>
                )}
              </div>
              <br />
              <SettingsContainer>
                <OptionPaneWithForm onChangeStatus={setStatus}/>

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
  height: 25px;
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
  font-weight: 400px;
  font-size: 13px;
  .ant-checkbox-inner {
    background-color: #f4f7fe;
    border: none; //it is important to remove border
  }
  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #2b3674;
    padding: 2px !important;
  }
`;

const HolidaysContainer = styled(Checkbox.Group)`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-rows: 30px;
  align-items: center;
  overflow-y: scroll;
  height: 15vh;
  font-size: 5px !important;
  .ant-checkbox-wrapper {
    margin-inline-start: 0px !important;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 30px 30px 30px 30px;
  align-items: center;
  font-family: "DM Sans";
  font-weight: 500;
  // font-size: 18px;
  line-height: 100%;
  margin-top: 10px;
`;

const SettingsSubheader = styled.div`
  color: #2b3674;
  font-weight: 500;
  font-size: 18px;
  border-bottom: 1px solid #2b3674;
  font-family: "DM Sans";
`;
const UnlimitedContainer = styled.div`
  padding: 15px 0px;
  p {
    background-color: #f4f7fe;
    padding: 15px 10px;
    border-radius: 10px;
    font-family: "DM Sans";
    font-size: 12px;
  }
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

const SaveChangesActiveButton = styled.button`
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
  background-color: rgba(56, 64, 119, 0.6);
  color: white;
`;
const SaveChangesInactiveButton = styled.button`
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
const ChangesSavedText = styled.p`
  float: right;
  font-size: 15px;
  text-align: right;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
  margin-right: 5px;
  padding-left: 15px;
`;

const AddHolidayContainer = styled.div`
  display: flex;
  border-radius: 15px;
  margin-top: 2px;
`;

const CustomAddHolidayInput = styled(Input)`
  border: none;
  background-color: transparent;
  border-radius: 0px 15px 15px 0px;
  background-color: #f4f7fe;
  position: relative;
  right: 6px;
  &:focus {
    outline: none;
    box-shadow: none;
    border: none;
  }
`;
const CustomAddHolidayButton = styled(Typography)`
  align-items: center;
  padding: 2px 8px 0px 8px; //trbl
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #2b3674;
`;
const CustomAddHolidayImage = styled.img`
  padding: 5px 6px;
  cursor: pointer;
  border-radius: 6px;
  width: 23px;
  background-color: #f4f7fe;
  z-index: 1;
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
  padding: 10px 20px;
  font-family: "DM Sans";
`;

const TimeOffSettingsHeader = styled.div`
  color: #2b3674;
  float: left;
  text-align: left;
  font-size: 23px;
  font-weight: 700;
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
