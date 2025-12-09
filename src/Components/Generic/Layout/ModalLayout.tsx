import React from 'react';
import LogoutModal from '../Modals/LogoutModal';
import AddMediaModal from '../Modals/AddMedia';
import CommonListModal from '../Modals/CommonListModal';
import CreateNewPostModal from '../Modals/CreatNewPostModal';

const ModalLayout = () => {
  return (
    <>
      <LogoutModal />
      <AddMediaModal />
      <CreateNewPostModal />
      {/* <CommonListModal /> */}
    </>
  );
};

export default ModalLayout;
