import { arrayMove } from '@dnd-kit/sortable';
import {
  EntityId, EntityState, PayloadAction, createEntityAdapter, createSlice,
} from '@reduxjs/toolkit';

import { EMPTY_POINT, Point } from '../../utils/math';
import { generateId } from '../../utils/utilities';

// DnD Kit Id for the "outside space"
export const OUTSIDE_DROPPABLE_ID = 'outside';

// Handle calculators
type Calculator = {
  id: EntityId,
  position: Point,
  currentTab: EntityId | null,
  tabs: EntityId[],
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
  };
}

const calculatorsAdapter = createEntityAdapter<Calculator>();
// Auxiliary methods for handling other regular calculatorsAdapter operations
const removeTabFromCalculator = (
  state: EntityState<Calculator>,
  calculatorId: EntityId,
  tabId: EntityId,
) => {
  const calculator = calculatorsSelectors.selectById(state, calculatorId);
  if (!calculator) return;
  calculatorsAdapter.updateOne(
    state,
    { id: calculator.id, changes: { tabs: calculator.tabs.filter((tId) => tId !== tabId) } },
  );
  // "Refresh from db"
  const refreshed = calculatorsSelectors.selectById(state, calculator.id)!;
  // If it was left empty, delete it; otherwise, check the current tab
  if (refreshed.tabs.length === 0) calculatorsAdapter.removeOne(state, refreshed.id);
  else if (refreshed.currentTab === tabId) {
    calculatorsAdapter.updateOne(
      state,
      { id: refreshed.id, changes: { currentTab: refreshed.tabs.at(-1) } },
    );
  }
};
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

// Ids for DnD kit
const TABS_ID_PREFIX = 'tab';
function generateCalculatorTabId() {
  return `${TABS_ID_PREFIX}-${generateId()}`;
}
export function isCalculatorTab(id: EntityId) {
  return id.toString().startsWith(TABS_ID_PREFIX);
}

function generateTab(): Tab {
  return {
    id: generateCalculatorTabId(),
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
    draggingTab: (null as EntityId | null),
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
      // This handles the DragEndEvent from DnD Kit
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
    moveTabStart: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      // This handles the DragStartEvent from DnD Kit
      const { tabId } = action.payload;
      state.draggingTab = tabId;
      const calculator = tabCalculatorSelector(state.calculators, tabId)!;
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
      const tabCalculator = tabCalculatorSelector(state.calculators, tabId)!;
      const overCalculator = isCalculator(overId)
        ? calculatorsSelectors.selectById(state.calculators, overId)!
        : tabCalculatorSelector(state.calculators, overId)!;
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
      const tabCalculator = tabCalculatorSelector(state.calculators, tabId)!;
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
      action: PayloadAction<{ tabId: EntityId, update: Partial<Omit<Tab, 'id' | 'calculatorId'>> }>,
    ) => {
      const { tabId, update } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes: update });
    },
    deleteTab: (state, action: PayloadAction<EntityId>) => {
      const tabId = action.payload;
      tabsAdapter.removeOne(state.tabs, tabId);
      const calculator = tabCalculatorSelector(state.calculators, tabId)!;
      removeTabFromCalculator(state.calculators, calculator.id, tabId);
      if (calculatorsSelectors.selectTotal(state.calculators) === 0) state.show = false;
    },
  },
});

export const {
  setShow,
  moveCalculator,
  createTab,
  switchTab,
  moveTabStart,
  moveTabOver,
  moveTabEnd,
  updateTab,
  deleteTab,
} = calculatorsSlice.actions;
export default calculatorsSlice.reducer;
