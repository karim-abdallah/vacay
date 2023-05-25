import { Card, CardBody } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Form, InputNumber, Checkbox, Tooltip, Input, Typography } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getPTOSettings, getHolidays } from '../../store/dashboard/selector';
import { tooltipBackground, cardHoverColor } from '../../styles/constants';
import { minSettingsValueDays, maxSettingsValueDays } from '../../constants';
import {
  TimeOffSettingsInstructions,
  PublicHolidaysSettingsInstructions,
} from './instructionText';
import minimize from '../../assets/images/minimize.png';
import plus from '../../assets/images/plus1.svg';
import settingsIcon from '../../assets/images/settings.png';
import { put, get, patch, post } from '../../helpers/api_helper';

function HolidayCheckbox(props) {
  const { holiday, onChange } = props;

  const handleCheckboxChange = event => {
    const isChecked = event.target.checked;
    onChange(holiday.id, isChecked);
  };

  return (
    <CheckboxWrapper>
      <input
        type="checkbox"
        value={holiday.name}
        onChange={handleCheckboxChange}
        checked={holiday.active}
      />
      <Tooltip color={tooltipBackground} title={holiday.date}>
        {holiday.name}
      </Tooltip>
    </CheckboxWrapper>
  );
}

function AddHolidayButton({ fetchHoliday }) {
  const [name, setName] = useState('');
  const pattern = /(\d{4}\/\d{2}\/\d{2})\s(.+)/;

  const setHoliday = async () => {
    if (name && pattern.test(name)) {
      const obj = {
        date: name.match(pattern)[1],
        name: name.match(pattern)[2],
      };
      try {
        await post('/dashboard/update-holidays-status', obj);
        await setName('');
        await fetchHoliday(); // Call the fetchHoliday function after setting the holiday
      } catch (error) {
        console.log('error===>', error);
      }
    }
  };
  const [openInput, setOpenInput] = useState(false);
  const handletoggleInput = async () => {
    setOpenInput(!openInput);
    if (name) {
      await setHoliday();
    } else {
      return null;
    }
  };

  return (
    <AddHolidayContainer>
      <CustomAddHolidayImage src={plus} onClick={handletoggleInput} />

      {openInput && (
        <CustomAddHolidayInput
          size="small"
          onPressEnter={handletoggleInput}
          placeholder="YYYY/MM/DD |Holiday Name"
          onChange={e => setName(e.target.value)}
        />
      )}
      {!openInput && (
        <CustomAddHolidayButton type="text" onClick={handletoggleInput}>
          Add Holiday
        </CustomAddHolidayButton>
      )}
    </AddHolidayContainer>
  );
}

const HolidaysPane = () => {
  // Fetch time off settings from back-end
  const dispatch = useDispatch();
  const [holidaydata, setHolidaydata] = useState([]);

  const fetchHoliday = async () => {
    let data = await get('/dashboard/holidays-settings');
    setHolidaydata(data);

    const HOLIDAYSettings = {
      holidayData: data.map(item => ({
        id: item.id,
        name: item.name,
        date: new Date(item.date),
        active: item.active,
      })),
    };

    dispatch({ type: 'holidays/update', payload: HOLIDAYSettings });
  };

  useEffect(() => {
    setTimeout(() => {
      fetchHoliday();
    }, 500);
  }, []);

  const getholiday = useSelector(getHolidays);
  const settings = useSelector(getPTOSettings);
  const sortedHolidays = holidaydata.sort((a, b) => a.date - b.date);

  const checkboxHandler = async (checkboxId, isChecked) => {
    await patch('/dashboard/update-holidays-status', {
      id: checkboxId,
      active: isChecked,
    });
    fetchHoliday();
  };

  const holidayCheckboxes = sortedHolidays.map((item, index) => {
    return (
      <HolidayCheckbox
        key={item.id}
        holiday={item}
        onChange={checkboxHandler}
      />
    );
  });

  return (
    <HolidayPaneContainer>
      <SettingsSubheader>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Public Holidays{' '}
            <StyledInfoTooltip
              title={PublicHolidaysSettingsInstructions()}
              arrow
              placement="bottomLeft"
              trigger="click"
              color={tooltipBackground}
            >
              i
            </StyledInfoTooltip>
          </span>
          <span style={{ fontSize: '16px' }}>
            {settings.PTOSettings.country}
          </span>
        </div>
      </SettingsSubheader>
      <HolidaysContainer>
        {holidayCheckboxes}
        {sortedHolidays.length < 30 ? (
          <div style={{ gridColumn: 'span 1' }}>
            <AddHolidayButton fetchHoliday={fetchHoliday} />
          </div>
        ) : (
          <Error style={{ gridColumn: 'span 2' }}>
            Holidays reached the maximum limit
          </Error>
        )}
      </HolidaysContainer>
    </HolidayPaneContainer>
  );
};
function NumberOptionDays(props) {
  const handleChange = value => {
    if (value !== null) {
      props.onChangeStatus('active'); // Update status to "active" when input changes
    }
  };
  return (
    <StyledFormItem name={props.name} className="text-end">
      <InputNumber
        style={{ width: '100px' }}
        size="small"
        min={minSettingsValueDays}
        max={maxSettingsValueDays}
        onChange={handleChange}
        addonAfter="days"
      />
    </StyledFormItem>
  );
}

const OptionPaneWithForm = ({ onChangeStatus }) => {
  const dispatch = useDispatch();

  const settings = useSelector(getPTOSettings);
  const fields = [
    { name: 'ptoAllowance', value: settings.PTOSettings.annualAllowanceDays },
    { name: 'ptoCap', value: settings.PTOSettings.accrualCapDays },
    { name: 'ptoBalance', value: settings.PTOSettings.currentBalanceDays },
  ];
  const updateSettingsHandler = (_, allValues) => {
    dispatch({ type: 'settings/update', payload: allValues });
  };
  return (
    <OptionsPaneContainer>
      <SettingsSubheader>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Time Off Policy{' '}
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
          <span style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            {settings.PTOSettings.accrualType}
          </span>
        </div>
      </SettingsSubheader>
      {settings.PTOSettings.accrualType === 'unlimited' ? (
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
              <NumberOptionDays
                name="ptoAllowance"
                onChangeStatus={onChangeStatus}
              />
              <div>Annual Cap</div>
              <NumberOptionDays name="ptoCap" onChangeStatus={onChangeStatus} />
              <div>Current Balance</div>
              <NumberOptionDays
                name="ptoBalance"
                onChangeStatus={onChangeStatus}
              />
            </OptionsContainer>
          </Form>
        </>
      )}
    </OptionsPaneContainer>
  );
};

const TimeOffSettings = () => {
  const [status, setStatus] = useState('inactive');
  const [expandedSettings, setExpandedSettings] = useState(false);
  const settings = useSelector(getPTOSettings);

  const updateSettings = async () => {
    const payload = {
      annual_allowance_days: settings.PTOSettings.annualAllowanceDays,
      accrual_cap_days: settings.PTOSettings.accrualCapDays,
      current_balance_days: settings.PTOSettings.currentBalanceDays,
    };
    await put('/dashboard/time-off-settings', payload);
  };

  const handleSaveChanges = () => {
    if (status === 'active') {
      updateSettings();
      setStatus('completed');
    }
  };
  const handleExpandSettings = () => {
    setExpandedSettings(!expandedSettings);
  };

  return (
    <>
      {!expandedSettings ? (
        <div>
          <TimeOffSettingsButton onClick={handleExpandSettings}>
            <SmallTimeOffSettingsIcon src={settingsIcon} />
          </TimeOffSettingsButton>
        </div>
      ) : (
        <Card>
          <ExpandedTimeOffSettingsCard>
            <TimeOffSettingsContainer>
              <div>
                <TimeOffSettingsHeader>
                  Settings <SmallTimeOffSettingsIcon src={settingsIcon} />
                </TimeOffSettingsHeader>

                <MinimizeButton onClick={handleExpandSettings}>
                  <StyledMinimizeIcon src={minimize} alt="x" />
                </MinimizeButton>
                {status === 'active' && (
                  <SaveChangesActiveButton onClick={handleSaveChanges}>
                    Save Changes
                  </SaveChangesActiveButton>
                )}

                {status === 'inactive' && (
                  <SaveChangesInactiveButton onClick={handleSaveChanges}>
                    Save Changes
                  </SaveChangesInactiveButton>
                )}

                {status === 'completed' && (
                  <ChangesSavedText>Changes saved!</ChangesSavedText>
                )}
              </div>
              <br />
              <SettingsContainer>
                <OptionPaneWithForm onChangeStatus={setStatus} />

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
  height: 13px;
`;

const StyledFormItem = styled(Form.Item)`
  margin: 0px;
  height: 32px;
  .ant-input-number-input {
    background: #f4f7fe;
    color: #384077 !important;
    font-size: 12px !important;
    font-weight: 700 !important;
  }
`;

const OptionsPaneContainer = styled.div`
  display: inline-grid;
  grid-template-rows: 30px 30px;
`;

const HolidayPaneContainer = styled.div`
  display: grid;
  grid-template-rows: 30px;
`;

const HolidaysContainer = styled(Checkbox.Group)`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 30px;
  align-items: center;
  overflow-y: auto; /* Change to 'auto' to conditionally show the scrollbar */
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
  font-family: 'DM Sans';
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
  font-family: 'DM Sans';
`;
const UnlimitedContainer = styled.div`
  padding: 15px 0px;
  p {
    background-color: #f4f7fe;
    padding: 15px 10px;
    border-radius: 10px;
    font-family: 'DM Sans';
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
    background-color: ${props => !props.showpointer && cardHoverColor};
  }
`;

const SaveChangesActiveButton = styled.button`
  float: right;
  font-size: 15px;
  text-align: right;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
  margin-right: 5px;
  padding-left: 15px;
  border-width: 0px;
  background-color: #384077;
  border-radius: 21px;
  color: white;
  font-weight: 500;
`;
const SaveChangesInactiveButton = styled.button`
  float: right;
  font-size: 15px;
  text-align: right;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 15px;
  margin-right: 5px;
  padding-left: 15px;
  border-width: 0px;
  border-radius: 21px;
  background-color: #888cad;
  color: white;
  font-weight: 500;
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
  font-weight: 500;
  color: #2b3674;
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
  padding: 4px 8px 4px 8px;
  border-width: 0px;
  background-color: #f4f7fe;
  color: #2b3674;
`;

const TimeOffSettingsContainer = styled.div`
  display: grid;
  padding: 10px 20px;
  font-family: 'DM Sans';
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
const CheckboxWrapper = styled.div`
  font-weight: 500;
  font-size: 13px;

  input[type='checkbox'] {
    position: relative;
    cursor: pointer;
  }
  input[type='checkbox']:before {
    content: '';
    display: block;
    width: 17px;
    height: 17px;

    background-color: #f4f7fe;
  }
  input[type='checkbox']:checked:after {
    content: '';
    display: block;
    width: 5px;
    height: 10px;
    border: solid #2b3674;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 6px;
  }
  span {
    margin-left: 10px;
  }
`;

const Error = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 5px 10px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;
export default TimeOffSettings;
