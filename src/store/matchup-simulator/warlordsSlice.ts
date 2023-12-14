import { arrayMove } from '@dnd-kit/sortable';
import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { generateId } from '../../utils/utilities';

// Handle tabs
type WarlordTab = {
  id: EntityId,
  name: string | null,
  lockedOrder: EntityId[],
  attackBenchWLs: EntityId[],
  attackWLs: EntityId[],
  defenseWLs: EntityId[],
  defenseBenchWLs: EntityId[],
};

function generateTab(): WarlordTab {
  return {
    id: generateId(),
    name: null,
    lockedOrder: [],
    attackBenchWLs: [],
    attackWLs: [],
    defenseWLs: [],
    defenseBenchWLs: [],
  };
}

const tabsAdapter = createEntityAdapter<WarlordTab>();
export const warlordTabsSelectors = tabsAdapter.getSelectors();

// Handle warlords
type Warlord = {
  id: EntityId,
  image: string,
};

const warlordsAdapter = createEntityAdapter<Warlord>();
export const warlordsSelectors = warlordsAdapter.getSelectors();

// For the cropper
export type CropConfig = 'TOWER_x1' | 'TOWER_x2' | 'WALKING_x1' | 'WALKING_x2' | 'WALKING_x3';
type CropperOpenFor = null | 'attack' | 'defense';

const warlordsSlice = createSlice({
  name: 'warlords',
  initialState: {
    tabs: tabsAdapter.getInitialState(),
    orderedTabs: ([] as EntityId[]),
    currentTab: (null as EntityId | null),
    draggingTab: (null as EntityId | null),
    warlords: warlordsAdapter.getInitialState(),
    show: false,
    cropper: {
      openFor: null as CropperOpenFor,
      currentImage: null as null | string,
      cropMode: 'TOWER_x1' as CropConfig,
      croppedWls: [] as string[],
      lock: false,
    },
  },
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      if (warlordTabsSelectors.selectTotal(state.tabs) === 0 && action.payload) {
        // Create a tab
        const tab = generateTab();
        tabsAdapter.addOne(state.tabs, tab);
        state.orderedTabs = [tab.id];
        state.currentTab = tab.id;
      }
      state.show = action.payload;
    },
    switchTab: (state, action: PayloadAction<EntityId>) => {
      state.currentTab = action.payload;
    },
    createTab: (state) => {
      const tab = generateTab();
      tabsAdapter.addOne(state.tabs, tab);
      state.orderedTabs = [...state.orderedTabs, tab.id];
      // Set is as current
      state.currentTab = tab.id;
    },
    updateTabName: (state, action: PayloadAction<{ tabId: EntityId, name: string }>) => {
      const { tabId, name } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes: { name } });
    },
    deleteTab: (state, action: PayloadAction<EntityId>) => {
      const tabId = action.payload;
      tabsAdapter.removeOne(state.tabs, tabId);
      state.orderedTabs = state.orderedTabs.filter((id) => id !== tabId);
      if (warlordTabsSelectors.selectTotal(state.tabs) === 0) {
        state.show = false;
        state.currentTab = null;
      } else if (state.currentTab === tabId) {
        state.currentTab = warlordTabsSelectors.selectIds(state.tabs).at(-1) ?? null;
      }
    },
    moveTabStart: (state, action: PayloadAction<EntityId>) => {
      state.draggingTab = action.payload;
      state.currentTab = action.payload;
    },
    moveTabEnd: (state, action: PayloadAction<{ tabId: EntityId, overId: EntityId | null }>) => {
      // This handles the DragEndEvent from DnD kit
      state.draggingTab = null;
      const { tabId, overId } = action.payload;
      if (overId === tabId) return;
      const tabs = state.orderedTabs;
      const oldIndex = tabs.indexOf(tabId);
      const newIndex = overId ? tabs.indexOf(overId) : (tabs.length - 1);
      state.orderedTabs = arrayMove(state.orderedTabs, oldIndex, newIndex);
      state.currentTab = tabId;
    },
    openCropper: (state, action: PayloadAction<CropperOpenFor>) => {
      if (action.payload !== null) {
        // Opening; reset it all
        state.cropper.currentImage = null;
        state.cropper.cropMode = 'TOWER_x1';
        state.cropper.croppedWls = [];
        state.cropper.lock = false;
      }
      state.cropper.openFor = action.payload;
    },
    cutCropper: (state, action: PayloadAction<string[]>) => {
      state.cropper.croppedWls = [...state.cropper.croppedWls, ...action.payload];
    },
    setCropperImage: (state, action: PayloadAction<string | null>) => {
      state.cropper.currentImage = action.payload;
    },
  },
});

export const {
  setShow,
  switchTab,
  createTab,
  deleteTab,
  moveTabStart,
  moveTabEnd,
  updateTabName,
  openCropper,
  cutCropper,
  setCropperImage,
} = warlordsSlice.actions;
export default warlordsSlice.reducer;
