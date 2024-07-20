import React, { useState } from 'react';
import {
  Button, Checkbox, Divider, List, ListItem, ListItemButton, ListItemText, Stack, TextField,
  Typography,
} from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import Modal from '../common/styled/Modal';

function SelectForScreenshotModal() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tabList = useAppSelector(calculatorsSelectors.getTabList);
  const open = useAppSelector(calculatorsSelectors.getShowSelectMultiple);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<EntityId[]>([]);

  const handleClose = () => {
    dispatch(calculatorsActions.setShowSelectMultiple(false));
    setSelected([]);
    setTitle('');
  };

  const handleSelect = (tabId: EntityId) => {
    setSelected((curr) => {
      if (curr.includes(tabId)) return curr.filter((tId) => tId !== tabId);
      return [...curr, tabId];
    });
  };

  return (
    <Modal open={open} onClose={() => handleClose()}>
      <Stack spacing={1}>
        <Typography>
          { t('calculators.tab.copyImage.multiple.description') }
        </Typography>
        {
          tabList.map((calculatorTabList, i) => (
            <React.Fragment key={JSON.stringify(calculatorTabList)}>
              <List>
                {
                calculatorTabList.map(({ id: tabId, name }) => (
                  <ListItem
                    key={tabId}
                    secondaryAction={(
                      <Checkbox
                        edge="end"
                        onChange={() => handleSelect(tabId)}
                        checked={selected.includes(tabId)}
                      />
                  )}
                    disablePadding
                  >
                    <ListItemButton onClick={() => handleSelect(tabId)}>
                      <ListItemText primary={name} />
                    </ListItemButton>
                  </ListItem>
                ))
              }
              </List>
              { i < (tabList.length - 1) ? <Divider /> : null }
            </React.Fragment>
          ))
        }
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label={t('calculators.tab.copyImage.multiple.title')}
          placeholder={t('calculators.tab.copyImage.multiple.title_placeholder')}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          onClick={() => {
            dispatch(calculatorsActions.screenshotMultipleTabs({ tabIds: selected, title }));
            handleClose();
          }}
        >
          { t('calculators.tab.copyImage.multiple.submit') }
        </Button>
      </Stack>
    </Modal>
  );
}

export default SelectForScreenshotModal;
