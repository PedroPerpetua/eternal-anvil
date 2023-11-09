import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { EMPTY_POINT, Point } from '../../utils/math';
import { generateId } from '../../utils/utilities';

type Tab = {
  id: EntityId,
  name: string | null,
  startingPoint: Point,
  endingPoint: Point,
  penalty: number,
  speed: number,
};

function generateTab() {
  return {
    id: generateId(),
    name: null,
    startingPoint: EMPTY_POINT,
    endingPoint: EMPTY_POINT,
    penalty: 0,
    speed: Infinity,
  } as Tab;
}

const tabsAdapter = createEntityAdapter<Tab>();
export const tabsSelectors = tabsAdapter.getSelectors();

const extraInitialState: { open: boolean, currentTab: EntityId | null } = {
  open: false,
  currentTab: null,
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: tabsAdapter.getInitialState(extraInitialState),
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
      if (state.open && state.currentTab === null) {
        if (tabsSelectors.selectTotal(state) === 0) {
          // No tabs; create one
          const tab = generateTab();
          tabsAdapter.addOne(state, tab);
          state.currentTab = tab.id;
        } else {
          state.currentTab = tabsSelectors.selectAll(state)[0].id;
        }
      }
    },
    switchTab: (state, action: PayloadAction<EntityId | null>) => {
      state.currentTab = action.payload;
    },
    createTab: (state) => {
      // Auto-generate an Id on creation
      const tab = generateTab();
      tabsAdapter.addOne(state, tab);
      state.currentTab = tab.id;
    },
    deleteTab: (state, action: PayloadAction<EntityId>) => {
      tabsAdapter.removeOne(state, action.payload);
      if (tabsSelectors.selectTotal(state) === 0) {
        state.open = false;
        state.currentTab = null;
      } else if (state.currentTab === action.payload) {
        state.currentTab = tabsSelectors.selectIds(state).at(0) ?? null;
      }
    },
    setName: (state, action: PayloadAction<{ id: EntityId, newName: string }>) => {
      tabsAdapter.updateOne(
        state,
        { id: action.payload.id, changes: { name: action.payload.newName } },
      );
    },
    setStartingPoint: (state, action: PayloadAction<Point>) => {
      if (state.currentTab === null) {
        const tab = generateTab();
        tabsAdapter.addOne(state, tab);
        state.currentTab = tab.id;
      }
      tabsAdapter.updateOne(
        state,
        { id: state.currentTab, changes: { startingPoint: action.payload } },
      );
    },
    setEndingPoint: (state, action: PayloadAction<Point>) => {
      if (state.currentTab === null) {
        const tab = generateTab();
        tabsAdapter.addOne(state, tab);
        state.currentTab = tab.id;
      }
      tabsAdapter.updateOne(
        state,
        { id: state.currentTab, changes: { endingPoint: action.payload } },
      );
    },
    setPenalty: (state, action: PayloadAction<number>) => {
      if (state.currentTab === null) {
        const tab = generateTab();
        tabsAdapter.addOne(state, tab);
        state.currentTab = tab.id;
      }
      tabsAdapter.updateOne(state, { id: state.currentTab, changes: { penalty: action.payload } });
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      if (state.currentTab === null) {
        const tab = generateTab();
        tabsAdapter.addOne(state, tab);
        state.currentTab = tab.id;
      }
      tabsAdapter.updateOne(state, { id: state.currentTab, changes: { speed: action.payload } });
    },
  },
});

export const {
  setOpen,
  switchTab,
  createTab,
  deleteTab,
  setName,
  setStartingPoint,
  setEndingPoint,
  setPenalty,
  setSpeed,
} = tabsSlice.actions;
export default tabsSlice.reducer;
