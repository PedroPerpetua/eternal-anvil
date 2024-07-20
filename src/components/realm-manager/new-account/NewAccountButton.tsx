import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CreateAccountForm from './CreateAccountForm';
import JoinAccountForm from './JoinAccountForm';
import GameButton from '../../common/styled/GameButton';
import Modal from '../../common/styled/Modal';

function NewAccountButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'create' | 'join'>('create');
  return (
    <>
      <GameButton onClick={() => setOpen(true)}>new account</GameButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Tabs variant="fullWidth" value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label={t('realmManager.account.create.tab')} value="create" />
          <Tab label={t('realmManager.account.join.tab')} value="join" />
        </Tabs>
        <div role="tabpanel" hidden={currentTab !== 'create'}>
          <CreateAccountForm />
        </div>
        <div role="tabpanel" hidden={currentTab !== 'join'}>
          <JoinAccountForm />
        </div>
      </Modal>
    </>
  );
}

export default NewAccountButton;
