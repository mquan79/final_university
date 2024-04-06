import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroup } from '../../store/Slice/groupSlice';
const GroupComponent = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);
  const idGroup = useSelector((state) => state.group.group);

  const setIdGroup = (id) => {
    dispatch(setGroup(id));
  };

  return (
    <div>
      Group
      {groups && groups.map((group) => (
        <div key={group._id} style={{ cursor: 'pointer' }} onClick={() => setIdGroup(group._id)}>
          {group.nameGroup}
        </div>
      ))}
      <br></br>
      <button onClick={() => setIsOpenCreateGroup(true)}>Create group</button>
      {isOpenCreateGroup && (
        <>
          <input type='text' onChange={(e) => setNameGroup(e.target.value)} value={nameGroup} />
          <button onClick={createGroup}>Create</button>
        </>
      )}
      <div>ID Group: {idGroup}</div>
    </div>
  );
};

export default GroupComponent;
