const INIT_STATE = {
  groups: [],
};

const PlanWithFriends = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "planWithFriends/addFriend":
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
    default:
      return state;
  }
};

export default PlanWithFriends;
