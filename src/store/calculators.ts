import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import { generateId } from './utils';

import type { RootState } from '.';

// Calculators ---------------------------------------------------------------
export type Calculator = {
  id: EntityId,
  currentTab: EntityId | null,
  tabs: EntityId[],
};

function generateCalculator(): Calculator {
  return {
    id: generateId(),
    currentTab: null,
    tabs: [],
  };
}

const calculatorsAdapter = createEntityAdapter<Calculator>();
const calculatorsEntitySelectors = calculatorsAdapter.getSelectors();

// Tabs ----------------------------------------------------------------------
export type CalculatorTab = {
  id: EntityId,
  name: string,
  mini: boolean,
  point1: [number | null, number | null],
  point2: [number | null, number | null],
  penalty: number | null,
  speed: number | null,
};

export const defaultTabName = 'Tab';
function generateTab(): CalculatorTab {
  return {
    id: generateId(),
    name: defaultTabName,
    mini: false,
    point1: [null, null],
    point2: [null, null],
    penalty: 0,
    speed: null,
  };
}

const tabsAdapter = createEntityAdapter<CalculatorTab>();
const tabsEntitySelectors = tabsAdapter.getSelectors();

// Auxiliary methods
function createCalculator(state: ReturnType<typeof calculatorsSlice.getInitialState>) {
  const calculator = generateCalculator();
  const tab = generateTab();
  calculator.tabs.push(tab.id);
  calculator.currentTab = tab.id;
  calculatorsAdapter.addOne(state, calculator);
  tabsAdapter.addOne(state.tabs, tab);
  return calculator;
}

function removeTabFromCalculator(
  state: ReturnType<typeof calculatorsSlice.getInitialState>,
  calculatorId: EntityId,
  tabId: EntityId,
) {
  const calculator = calculatorsEntitySelectors.selectById(state, calculatorId);
  if (!calculator) return;
  const originalIndex = calculator.tabs.indexOf(tabId);
  calculatorsAdapter.updateOne(
    state,
    { id: calculator.id, changes: { tabs: calculator.tabs.filter((tId) => tId !== tabId) } },
  );
  // "Refresh from db"
  const refreshed = calculatorsEntitySelectors.selectById(state, calculator.id)!;
  // If it was left empty, delete it; otherwise, check the current tab
  if (refreshed.tabs.length === 0) calculatorsAdapter.removeOne(state, refreshed.id);
  else if (refreshed.currentTab === tabId) {
    let newIndex;
    // Was the last element
    if (originalIndex === refreshed.tabs.length) newIndex = -1;
    else newIndex = originalIndex; // Make it the next tab
    calculatorsAdapter.updateOne(
      state,
      { id: refreshed.id, changes: { currentTab: refreshed.tabs.at(newIndex) } },
    );
  }
}

// Slice ---------------------------------------------------------------------
const calculatorsSlice = createSlice({
  name: 'calculators',
  initialState: calculatorsAdapter.getInitialState({
    tabs: tabsAdapter.getInitialState(),
    show: false,
    highestZIndex: 0,
    screenshots: {
      tabsOnScreenshot: [] as EntityId[],
      takeScreenshotFlag: 0, // We use this to signal component effects to take a screenshot
      showSelectMultiple: false,
    },
  }),
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      if (calculatorsEntitySelectors.selectTotal(state) === 0 && action.payload) {
        // No calculators to show; let's create one
        createCalculator(state);
      }
      state.show = action.payload;
    },
    createCalculator: (state) => {
      createCalculator(state);
    },
    updateCalculator: (state, action: PayloadAction<{ calculatorId: EntityId, changes: Partial<Omit<Calculator, 'id'>> }>) => {
      const { calculatorId, changes } = action.payload;
      calculatorsAdapter.updateOne(state, { id: calculatorId, changes });
    },
    createTab: (state, action: PayloadAction<{ calculatorId: EntityId }>) => {
      const { calculatorId } = action.payload;
      const tab = generateTab();
      tabsAdapter.addOne(state.tabs, tab);
      const calculator = calculatorsEntitySelectors.selectById(state, calculatorId);
      calculatorsAdapter.updateOne(state, {
        id: calculatorId,
        changes: { currentTab: tab.id, tabs: [...calculator.tabs, tab.id] },
      });
    },
    selectTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      const calculator = calculatorsEntitySelectors
        .selectAll(state)
        .find((c) => c.tabs.includes(tabId));
      if (!calculator) return;
      calculatorsAdapter.updateOne(state, { id: calculator.id, changes: { currentTab: tabId } });
    },
    updateTab: (state, action: PayloadAction<{ tabId: EntityId, changes: Partial<Omit<CalculatorTab, 'id'>> }>) => {
      const { tabId, changes } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes });
    },
    deleteTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      tabsAdapter.removeOne(state.tabs, tabId);
      const calculator = calculatorsEntitySelectors
        .selectAll(state)
        .find((c) => c.tabs.includes(tabId));
      if (!calculator) return;
      removeTabFromCalculator(state, calculator.id, tabId);
      if (calculatorsEntitySelectors.selectTotal(state) === 0) state.show = false;
    },
    screenshotTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      state.screenshots.tabsOnScreenshot = [tabId];
      state.screenshots.takeScreenshotFlag += 1;
    },
    screenshotMultipleTabs: (state, action: PayloadAction<{ tabIds: EntityId[] }>) => {
      const { tabIds } = action.payload;
      state.screenshots.tabsOnScreenshot = tabIds;
      state.screenshots.takeScreenshotFlag += 1;
    },
    setShowSelectMultiple: (state, action: PayloadAction<boolean>) => {
      state.screenshots.showSelectMultiple = action.payload;
    },
  },
});

// Exports -------------------------------------------------------------------
export default calculatorsSlice.reducer;
export const calculatorsActions = calculatorsSlice.actions;
export const calculatorsSelectors = {
  show: (state: RootState) => state.calculators.show,
  getCalculator: createSelector(
    [
      (state: RootState) => state.calculators,
      (state: RootState, calculatorId: EntityId) => calculatorId,
    ],
    (calculators, calculatorId) => calculatorsEntitySelectors.selectById(calculators, calculatorId),
  ),
  getCalculatorIds: createSelector(
    [(state: RootState) => state.calculators],
    (calculators) => calculatorsEntitySelectors.selectIds(calculators),
  ),
  getTab: createSelector(
    [
      (state: RootState) => state.calculators.tabs,
      (state: RootState, tabId) => tabId,
    ],
    (tabs, tabId) => tabsEntitySelectors.selectById(tabs, tabId),
  ),
  getTabActive: createSelector(
    [
      (state: RootState) => state.calculators,
      (state: RootState, tabId) => tabId,
    ],
    (calculators, tabId) => calculatorsEntitySelectors
      .selectAll(calculators)
      .some((c) => c.currentTab === tabId),
  ),
  getTabList: createSelector(
    [(state: RootState) => state.calculators],
    (calculators) => calculatorsEntitySelectors
      .selectAll(calculators)
      .map((c) => c.tabs.map(
        (tId) => {
          const { id, name } = tabsEntitySelectors.selectById(calculators.tabs, tId);
          return { id, name };
        },
      )),
  ),
  getTabsOnScreenshot: (state: RootState) => state.calculators.screenshots.tabsOnScreenshot,
  getTakeScreenshotFlag: (state: RootState) => state.calculators.screenshots.takeScreenshotFlag,
  getShowSelectMultiple: (state: RootState) => state.calculators.screenshots.showSelectMultiple,
};
