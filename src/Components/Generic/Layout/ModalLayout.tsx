import React from 'react';
import LogoutModal from '../Modals/LogoutModal';
import AddMediaModal from '../Modals/AddMedia';
import CommonListModal from '../Modals/CommonListModal';

const ModalLayout = () => {
  return (
    <>
      <LogoutModal />
      <AddMediaModal />
      {/* <CommonListModal /> */}
    </>
  );
};

export default ModalLayout;
