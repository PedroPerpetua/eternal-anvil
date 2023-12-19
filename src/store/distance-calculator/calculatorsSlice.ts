import { arrayMove } from '@alissavrk/dnd-kit-sortable';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, EntityState, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '..';
import { EMPTY_POINT } from '../../utils/math';
import type { Point } from '../../utils/math';
import { generateId } from '../../utils/utilities';

// DnD Kit Id for the "outside space"
export const OUTSIDE_DROPPABLE_ID = 'outside';

// Handle calculators
type Calculator = {
  id: EntityId,
  position: Point,
  currentTab: EntityId | null,
  tabs: EntityId[],
  order: number, // For zIndex purposes
};

// Ids for DnD kit
const CALCULATOR_ID_PREFIX = 'calculator';
function generateCalculatorId() {
  return `${CALCULATOR_ID_PREFIX}-${generateId()}`;
}
export function isCalculator(id: EntityId) {
  return id.toString().startsWith(CALCULATOR_ID_PREFIX);
}

function generateCalculator(): Calculator {
  return {
    id: generateCalculatorId(),
    position: [(window.innerWidth - 300) / 2, (window.innerHeight - 454) / 2],
    currentTab: null,
    tabs: [],
    order: 0,
  };
}

const calculatorsAdapter = createEntityAdapter<Calculator>();
const calculatorsEntitySelectors = calculatorsAdapter.getSelectors();

// Auxiliary methods for handling other regular calculatorsAdapter operations
const removeTabFromCalculator = (
  state: EntityState<Calculator, EntityId>,
  calculatorId: EntityId,
  tabId: EntityId,
) => {
  const calculator = calculatorsEntitySelectors.selectById(state, calculatorId);
  if (!calculator) return;
  calculatorsAdapter.updateOne(
    state,
    { id: calculator.id, changes: { tabs: calculator.tabs.filter((tId) => tId !== tabId) } },
  );
  // "Refresh from db"
  const refreshed = calculatorsEntitySelectors.selectById(state, calculator.id)!;
  // If it was left empty, delete it; otherwise, check the current tab
  if (refreshed.tabs.length === 0) calculatorsAdapter.removeOne(state, refreshed.id);
  else if (refreshed.currentTab === tabId) {
    calculatorsAdapter.updateOne(
      state,
      { id: refreshed.id, changes: { currentTab: refreshed.tabs.at(-1) } },
    );
  }
};
const getTabCalculator = (
  state: EntityState<Calculator, EntityId>,
  tabId: EntityId,
) => calculatorsEntitySelectors.selectAll(state).find((c) => c.tabs.includes(tabId))!;

// Handle calculator tabs
type Tab = {
  id: EntityId,
  name: string,
  startingPoint: Point,
  endingPoint: Point,
  penalty: number,
  speed: number,
};

// Ids for DnD kit
const TABS_ID_PREFIX = 'tab';
function generateCalculatorTabId() {
  return `${TABS_ID_PREFIX}-${generateId()}`;
}
export function isCalculatorTab(id: EntityId) {
  return id.toString().startsWith(TABS_ID_PREFIX);
}

export const DEFAULT_TAB_NAME = 'Calculator';
function generateTab(): Tab {
  return {
    id: generateCalculatorTabId(),
    name: DEFAULT_TAB_NAME,
    startingPoint: EMPTY_POINT,
    endingPoint: EMPTY_POINT,
    penalty: 0,
    speed: Infinity,
  };
}
const tabsAdapter = createEntityAdapter<Tab>();
const tabsEntitySelectors = tabsAdapter.getSelectors();

// Slice
const calculatorsSlice = createSlice({
  name: 'calculators',
  initialState: {
    calculators: calculatorsAdapter.getInitialState(),
    tabs: tabsAdapter.getInitialState(),
    show: false,
    draggingTab: (null as EntityId | null),
    highestOrder: 0, // To sort zIndex
  },
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      if (
        calculatorsEntitySelectors.selectTotal(state.calculators) === 0
        && action.payload
      ) {
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
      // This handles the DragEndEvent from DnD Kit
      const { calculatorId, delta } = action.payload;
      const calculator = calculatorsEntitySelectors.selectById(state.calculators, calculatorId);
      state.highestOrder += 1;
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: calculator.id,
          changes: {
            position: [calculator.position[0] + delta[0], calculator.position[1] + delta[1]],
            order: state.highestOrder,
          },
        },
      );
    },
    bringCalculatorToFront: (state, action: PayloadAction<{ calculatorId: EntityId }>) => {
      const { calculatorId } = action.payload;
      state.highestOrder += 1;
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: calculatorId, changes: { order: state.highestOrder } },
      );
    },
    createTab: (state, action: PayloadAction<{ calculatorId: EntityId }>) => {
      const { calculatorId } = action.payload;
      const calculator = calculatorsEntitySelectors.selectById(state.calculators, calculatorId);
      if (!calculator) return;
      const tab = generateTab();
      tabsAdapter.addOne(state.tabs, tab);
      // Add the tab and set as current
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: calculator.id, changes: { currentTab: tab.id, tabs: [...calculator.tabs, tab.id] } },
      );
    },
    switchTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      const calculatorId = getTabCalculator(state.calculators, tabId).id;
      calculatorsAdapter.updateOne(
        state.calculators,
        { id: calculatorId, changes: { currentTab: tabId } },
      );
    },
    moveTabStart: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      // This handles the DragStartEvent from DnD Kit
      const { tabId } = action.payload;
      state.draggingTab = tabId;
      const calculator = getTabCalculator(state.calculators, tabId);
      calculatorsAdapter.updateOne(state.calculators, {
        id: calculator.id,
        changes: { currentTab: tabId },
      });
    },
    moveTabOver: (state, action: PayloadAction<{ tabId: EntityId, overId: EntityId | null }>) => {
      // This handles the DragOverEvent from DnD Kit
      const { tabId, overId } = action.payload;
      // CASE: not over anything or over the same tab, do nothing
      if (!overId || overId === OUTSIDE_DROPPABLE_ID || tabId === overId) return;
      const tabCalculator = getTabCalculator(state.calculators, tabId);
      const overCalculator = isCalculator(overId)
        ? calculatorsEntitySelectors.selectById(state.calculators, overId)!
        : getTabCalculator(state.calculators, overId);
      // CASE: in the same container, do nothing
      if (tabCalculator === overCalculator) return;
      // CASE: it's in a different container
      // Remove it from the old container
      removeTabFromCalculator(state.calculators, tabCalculator.id, tabId);
      // Add it to the new container
      const newTabs = [...overCalculator.tabs];
      newTabs.splice(overCalculator.tabs.indexOf(overId), 0, tabId);
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: overCalculator.id,
          changes: {
            tabs: newTabs,
            currentTab: tabId,
          },
        },
      );
    },
    moveTabEnd: (
      state,
      action: PayloadAction<{ tabId: EntityId, overId: EntityId | null, delta: Point }>,
    ) => {
      // This handles the DragEndEvent from DnD kit
      state.draggingTab = null;
      const { tabId, overId, delta } = action.payload;
      const tabCalculator = getTabCalculator(state.calculators, tabId);
      // CASE: same tab, do nothing
      if (!overId || overId === tabId) return;
      // CASE: dropped outside
      if (overId === OUTSIDE_DROPPABLE_ID) {
        // Dropped it outside, so we should create a new calculator for it
        const calculator = generateCalculator();
        calculator.currentTab = tabId;
        calculator.tabs = [tabId];
        calculator.position = [
          tabCalculator.position[0] + delta[0],
          tabCalculator.position[1] + delta[1],
        ];
        calculatorsAdapter.addOne(state.calculators, calculator);
        // Remove it from the old calculator
        removeTabFromCalculator(state.calculators, tabCalculator.id, tabId);
        return;
      }
      // CASE: dropped in the same calculator
      // Since onDragOver will change the containers, it'll always be the same container
      const oldIndex = tabCalculator.tabs.indexOf(tabId);
      const newIndex = tabCalculator.tabs.indexOf(overId);
      calculatorsAdapter.updateOne(
        state.calculators,
        {
          id: tabCalculator.id,
          changes: { tabs: arrayMove(tabCalculator.tabs, oldIndex, newIndex) },
        },
      );
    },
    updateTab: (
      state,
      action: PayloadAction<{ tabId: EntityId, update: Partial<Omit<Tab, 'id'>> }>,
    ) => {
      const { tabId, update } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes: update });
    },
    deleteTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      tabsAdapter.removeOne(state.tabs, tabId);
      const calculator = getTabCalculator(state.calculators, tabId);
      removeTabFromCalculator(state.calculators, calculator.id, tabId);
      if (calculatorsEntitySelectors.selectTotal(state.calculators) === 0) state.show = false;
    },
  },
});

// Actions
export const calculatorsActions = calculatorsSlice.actions;

// Selectors
export const calculatorsSelectors = {
  calculatorsEntitySelectors,
  getCalculator: createSelector(
    [
      (state: RootState) => state.distanceCalculator.calculators,
      (state: RootState, calculatorId: EntityId) => calculatorId,
    ],
    (calculators, calculatorId) => calculatorsEntitySelectors.selectById(calculators, calculatorId),
  ),
  getCalculatorIds: createSelector(
    [(state: RootState) => state.distanceCalculator.calculators],
    (calculators) => (
      calculatorsEntitySelectors.selectAll(calculators)
        .sort((a, b) => a.order - b.order)
        .map((calc) => calc.id)
    ),
  ),
  getCalculatorTabsMap: createSelector(
    [(state: RootState) => state.distanceCalculator.calculators],
    (calculators) => Object.fromEntries(
      calculatorsEntitySelectors.selectAll(calculators).map((c) => [c.id, c.tabs]),
    ),
  ),
  tabsEntitySelectors,
  getTab: createSelector(
    [
      (state: RootState) => state.distanceCalculator.tabs,
      (state: RootState, tabId: EntityId) => tabId,
    ],
    (tabs, tabId) => tabsEntitySelectors.selectById(tabs, tabId),
  ),
  getTabIds: createSelector(
    [(state: RootState) => state.distanceCalculator.tabs],
    (tabs) => tabsEntitySelectors.selectIds(tabs),
  ),
  tabIsActive: createSelector(
    [
      (state: RootState) => state.distanceCalculator.calculators,
      (state: RootState, tabId: EntityId) => tabId,
    ],
    (calculators, tabId) => calculatorsEntitySelectors
      .selectAll(calculators)
      .some((c) => c.currentTab === tabId),
  ),
  draggingTab: (state: RootState) => state.distanceCalculator.draggingTab,
  show: (state: RootState) => state.distanceCalculator.show,
};

export default calculatorsSlice.reducer;
