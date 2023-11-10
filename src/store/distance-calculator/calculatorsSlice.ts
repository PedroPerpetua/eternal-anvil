import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { EMPTY_POINT, Point } from '../../utils/math';
import { generateId } from '../../utils/utilities';

// Handle calculators
type Calculator = {
  id: EntityId,
  position: Point,
  currentTab: EntityId | null,
};

function generateCalculator(): Calculator {
  return {
    id: generateId(),
    position: [0, 0], // TODO
    currentTab: null,
  };
}

const calculatorsAdapter = createEntityAdapter<Calculator>();
export const calculatorsSelectors = calculatorsAdapter.getSelectors();

// Handle calculator tabs
type Tab = {
  id: EntityId,
  calculatorId: EntityId,
  name: string | null,
  startingPoint: Point,
  endingPoint: Point,
  penalty: number,
  speed: number,
};

function generateTab(calculatorId: EntityId): Tab {
  return {
    id: generateId(),
    name: null,
    calculatorId,
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
        // Create a tab for the calculator
        const tab = generateTab(calculator.id);
        // Set that as the current tab
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
      const tab = generateTab(action.payload);
      tabsAdapter.addOne(state.tabs, tab);
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: action.payload, changes: { currentTab: tab.id } },
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
      let { calculatorId } = action.payload;
      const { tabId } = action.payload;
      const tab = calculatorTabsSelectors.selectById(state.tabs, tabId);
      if (!tab) return;
      if (calculatorId === null) { // Moved to no calculator
        // Create a new calculator for it
        const calculator = generateCalculator();
        calculator.currentTab = tabId;
        calculatorsAdapter.addOne(state.calculators, calculator);
        calculatorId = calculator.id;
      }
      const previousCalculator = calculatorsSelectors.selectById(
        state.calculators,
        tab.calculatorId,
      );
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes: { calculatorId } });
      // If the previous calculator is left empty, delete it
      if (!previousCalculator) return;
      const tabsLeft = calculatorTabsSelectors.selectAll(state.tabs)
        .filter((t) => t.calculatorId === previousCalculator.id);
      if (tabsLeft.length === 0) {
        calculatorsAdapter.removeOne(state.calculators, previousCalculator.id);
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
      const calculator = calculatorsSelectors.selectById(state.calculators, tab.calculatorId);
      tabsAdapter.removeOne(state.tabs, action.payload);
      if (!calculator) return;
      // If the calculator was left empty, delete it
      const remainingTabs = calculatorTabsSelectors.selectAll(state.tabs);
      const calculatorTabs = remainingTabs.filter((t) => t.calculatorId === calculator.id);
      if (calculatorTabs.length === 0) {
        calculatorsAdapter.removeOne(state.calculators, calculator.id);
        // If there are no calculators left, set closed
        if (remainingTabs.length === 0) {
          state.show = false;
        }
      } else if (calculator.currentTab === action.payload) {
        // We deleted the current tab, let's swap!
        calculatorsAdapter.updateOne(
          state.calculators,
          { id: calculator.id, changes: { currentTab: calculatorTabs.at(-1)?.id } },
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
