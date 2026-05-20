import React from 'react';
import LogoutModal from '../Modals/LogoutModal';
import AddMediaModal from '../Modals/AddMedia';
import CommonListModal from '../Modals/CommonListModal';
import CreateNewPostModal from '../Modals/CreatNewPostModal';
import MediaPreviewModal from '../Modals/MediaPreviewModal';

const ModalLayout = () => {
  return (
    <>
      <LogoutModal />
      <AddMediaModal />
      <CreateNewPostModal />
      <MediaPreviewModal />
      {/* <CommonListModal /> */}
    </>
  );
};

export default ModalLayout;
