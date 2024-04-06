import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTopic } from '../../store/Slice/groupSlice'
const TopicComponent = () => {
  const dispatch = useDispatch();
  const idGroup = useSelector((state) => state.group.group);
  const topicFilter = useSelector((state) => state.groups.topics);
  const idTopic = useSelector((state) => state.group.topic);

  const setIdTopic = (id) => {
    dispatch(setTopic(id));
  };

  return (
    <div>
      <button onClick={() => setIsOpenCreateTopic(true)}>Create Topic</button>
      {isOpenCreateTopic && (
        <>
          <input onChange={(e) => setNameTopic(e.target.value)} value={nameTopic}/>
          <button onClick={createTopic}>Create</button>
        </>
      )}
      {idGroup && (
        topicFilter.map((topic) => (
          <div key={topic._id} style={{ cursor: 'pointer' }} onClick={() => setIdTopic(topic._id)}>
            {topic.nameTopicGroup}
          </div>
        ))
      )}
      <div>ID TOPIC: {idTopic}</div>
    </div>
  );
};

export default TopicComponent;
