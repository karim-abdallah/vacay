import { groupMock } from '../../mocks/planWithFriends.mock';

const INIT_STATE = {
  groups: [groupMock],
};

const PlanWithFriends = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'planWithFriends/addFriend':
      // Takes in a group id and a friend object to add to a group
      return {
        ...state,
        groups: state.groups.map((item, index) => {
          if (item.groupId !== action.groupId) {
            return item;
          } else {
            const updatedGroup = {
              ...item,
              friends: [...item.friends, action.friend],
            };
            return updatedGroup;
          }
        }),
      };
    case 'planWithFriends/updateGroups':
      console.log(`Action`);
      console.log(action);
      return {
        ...state,
        groups: [...action.payload],
      };
    default:
      return state;
  }
};

export default PlanWithFriends;
