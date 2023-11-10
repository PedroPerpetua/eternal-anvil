import {
  EntityId, EntityState, PayloadAction, createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';

import { EMPTY_POINT, Point } from '../../utils/math';
import { generateId } from '../../utils/utilities';

// Handle calculators
type Calculator = {
  id: EntityId,
  position: Point,
  currentTab: EntityId | null,
  tabs: EntityId[],
};

function generateCalculator(): Calculator {
  return {
    id: generateId(),
    position: [0, 0], // TODO
    currentTab: null,
    tabs: [],
  };
}

const calculatorsAdapter = createEntityAdapter<Calculator>();
export const calculatorsSelectors = calculatorsAdapter.getSelectors();
export const tabCalculatorSelector = (
  state: EntityState<Calculator>,
  tabId: EntityId,
) => calculatorsSelectors.selectAll(state).find((c) => c.tabs.includes(tabId));

// Handle calculator tabs
type Tab = {
  id: EntityId,
  name: string | null,
  startingPoint: Point,
  endingPoint: Point,
  penalty: number,
  speed: number,
};

function generateTab(): Tab {
  return {
    id: generateId(),
    name: null,
    startingPoint: EMPTY_POINT,
    endingPoint: EMPTY_POINT,
    penalty: 0,
    speed: Infinity,
  };
}

const tabsAdapter = createEntityAdapter<Tab>();
export const calculatorTabsSelectors = tabsAdapter.getSelectors();

const calculatorsSlice = createSlice({
  name: 'calculators',
  initialState: {
    calculators: calculatorsAdapter.getInitialState(),
    tabs: tabsAdapter.getInitialState(),
    show: false,
  },
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      if (calculatorsSelectors.selectTotal(state.calculators) === 0 && action.payload === true) {
        // Create a calculator
        const calculator = generateCalculator();
        // Create a tab
        const tab = generateTab();
        // Add the tab and set as current
        calculator.tabs.push(tab.id);
        calculator.currentTab = tab.id;
        // Add them to the state
        calculatorsAdapter.addOne(state.calculators, calculator);
        tabsAdapter.addOne(state.tabs, tab);
      }
      state.show = action.payload;
    },
    moveCalculator: (state, action: PayloadAction<{ calculatorId: EntityId, delta: Point }>) => {
      const { calculatorId, delta } = action.payload;
      const calculator = calculatorsSelectors.selectById(state.calculators, calculatorId);
      if (!calculator) return;
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: calculator.id,
          changes: {
            position: [calculator.position[0] + delta[0], calculator.position[1] + delta[1]],
          },
        },
      );
    },
    createTab: (state, action: PayloadAction<EntityId>) => {
      const calculator = calculatorsSelectors.selectById(state.calculators, action.payload);
      if (!calculator) return;
      const tab = generateTab();
      tabsAdapter.addOne(state.tabs, tab);
      // Add the tab and set as current
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: calculator.id, changes: { currentTab: tab.id, tabs: [...calculator.tabs, tab.id] } },
      );
    },
    switchTab: (state, action: PayloadAction<{ calculatorId: EntityId, tabId: EntityId }>) => {
      const { calculatorId, tabId } = action.payload;
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: calculatorId, changes: { currentTab: tabId } },
      );
    },
    moveTab: (state, action: PayloadAction<{ tabId: EntityId, calculatorId: EntityId | null }>) => {
      const { calculatorId } = action.payload;
      const { tabId } = action.payload;
      const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
      if (!tab) return;
      if (calculatorId === null) { // Moved to no calculator
        // Create a new calculator for it
        const calculator = generateCalculator();
        calculator.currentTab = tabId;
        calculator.tabs = [tabId];
        calculatorsAdapter.addOne(state.calculators, calculator);
      }

      const previousCalculator = tabCalculatorSelector(state.calculators, tab.id);
      if (!previousCalculator) return;
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: previousCalculator.id,
          changes: { tabs: previousCalculator.tabs.filter((tId) => tId !== tab.id) },
        },
      );
      // If the previous calculator is left empty, delete it
      // "refresh from db"
      const refreshedCalculator = calculatorsSelectors.selectById(
        state.calculators,
        previousCalculator.id,
      );
      if (!refreshedCalculator) return;
      if (refreshedCalculator.tabs.length === 0) {
        calculatorsAdapter.removeOne(state.calculators, refreshedCalculator.id);
      }
    },
    updateTab: (
      state,
      action: PayloadAction<{ tabId: EntityId, update: Partial<Omit<Tab, 'id' | 'calculatorId'>> }>,
    ) => {
      const { tabId, update } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes: update });
    },
    deleteTab: (state, action: PayloadAction<EntityId>) => {
      const tab = calculatorTabsSelectors.selectById(state.tabs, action.payload);
      if (!tab) return;
      tabsAdapter.removeOne(state.tabs, action.payload);
      const calculator = tabCalculatorSelector(state.calculators, tab.id);
      if (!calculator) return;
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: calculator.id,
          changes: { tabs: calculator.tabs.filter((tId) => tId !== tab.id) },
        },
      );
      // If the calculator was left empty, delete it
      // "refresh from db"
      const refreshedCalculator = calculatorsSelectors.selectById(state.calculators, calculator.id);
      if (!refreshedCalculator) return;
      if (refreshedCalculator.tabs.length === 0) {
        calculatorsAdapter.removeOne(state.calculators, refreshedCalculator.id);
        // If there are no calculators left, set closed
        if (calculatorsSelectors.selectTotal(state.calculators) === 0) {
          state.show = false;
        }
      } else if (refreshedCalculator.currentTab === tab.id) {
        // We deleted the current tab, let's swap!
        calculatorsAdapter.updateOne(
          state.calculators,
          { id: refreshedCalculator.id, changes: { currentTab: refreshedCalculator.tabs.at(-1) } },
        );
      }
    },
  },
});

export const {
  setShow,
  moveCalculator,
  createTab,
  switchTab,
  moveTab,
  updateTab,
  deleteTab,
} = calculatorsSlice.actions;
export default calculatorsSlice.reducer;
