import { arrayMove } from '@dnd-kit/sortable';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import { generateId, insertAfter } from './utils';
import { calculatorHeight, calculatorSpacing, calculatorWidth } from '../components/calculators/utils';

import type { RootState } from '.';

// Calculators ---------------------------------------------------------------
export type Calculator = {
  id: EntityId,
  currentTab: EntityId | null,
  tabs: EntityId[],
  position: [number, number],
  zIndex: number
};

const calculatorPrefix = 'Calculator';

function generateCalculatorId() {
  return `${calculatorPrefix}-${generateId()}`;
}

export function isCalculatorId(id?: EntityId | null) {
  if (!id) return false;
  return id.toString().startsWith(calculatorPrefix);
}

function generateCalculator(): Calculator {
  return {
    id: generateCalculatorId(),
    currentTab: null,
    tabs: [],
    position: [
      Math.floor((window.innerWidth - calculatorWidth) / 2),
      Math.floor((window.innerHeight - calculatorHeight) / 2),
    ],
    zIndex: 0,
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

const tabPrefix = 'Tab';

function generateTabId() {
  return `${tabPrefix}-${generateId()}`;
}

export function isTabId(id?: EntityId | null) {
  if (!id) return false;
  return id.toString().startsWith(tabPrefix);
}

export const defaultTabName = 'Tab';
function generateTab(initialData?: Partial<CalculatorTab>): CalculatorTab {
  return {
    id: generateTabId(),
    name: defaultTabName,
    mini: false,
    point1: [null, null],
    point2: [null, null],
    penalty: 0,
    speed: null,
    ...initialData,
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
  state.highestZIndex += 1;
  calculator.zIndex = state.highestZIndex;
  calculatorsAdapter.addOne(state, calculator);
  state.orderedIds.push(calculator.id);
  tabsAdapter.addOne(state.tabs, tab);
  return calculator;
}

function removeTabFromCalculator(
  state: ReturnType<typeof calculatorsSlice.getInitialState>,
  calculatorId: EntityId,
  tabId: EntityId,
) {
  const calculator = calculatorsEntitySelectors.selectById(state, calculatorId);
  const originalIndex = calculator.tabs.indexOf(tabId);
  calculatorsAdapter.updateOne(
    state,
    { id: calculator.id, changes: { tabs: calculator.tabs.filter((tId) => tId !== tabId) } },
  );
  // "Refresh from db"
  const refreshed = calculatorsEntitySelectors.selectById(state, calculator.id)!;
  // If it was left empty, delete it; otherwise, check the current tab
  if (refreshed.tabs.length === 0) {
    calculatorsAdapter.removeOne(state, refreshed.id);
    state.orderedIds = state.orderedIds.filter((cId) => cId !== refreshed.id);
  } else if (refreshed.currentTab === tabId) {
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

function findCalculator(
  state: ReturnType<typeof calculatorsSlice.getInitialState>,
  tabId: EntityId,
) {
  return calculatorsEntitySelectors.selectAll(state).find((c) => c.tabs.includes(tabId))!;
}

// Slice ---------------------------------------------------------------------
export type DisplayMode = 'grid' | 'free-drag';
const calculatorsSlice = createSlice({
  name: 'calculators',
  initialState: calculatorsAdapter.getInitialState({
    orderedIds: [] as EntityId[],
    highestZIndex: 0,
    tabs: tabsAdapter.getInitialState(),
    show: false,
    displayMode: 'grid' as DisplayMode,
    screenshots: {
      tabsOnScreenshot: [] as EntityId[],
      takeScreenshotFlag: 0, // We use this to signal component effects to take a screenshot
      showSelectMultiple: false,
    },
    dragging: null as EntityId | null,
  }),
  reducers: {
    setShow: (state, action: PayloadAction<boolean>) => {
      if (calculatorsEntitySelectors.selectTotal(state) === 0 && action.payload) {
        // No calculators to show; let's create one
        createCalculator(state);
      }
      state.show = action.payload;
    },
    setDisplayMode: (state, action: PayloadAction<DisplayMode>) => {
      if (state.displayMode === 'free-drag') {
        // Re-organize the ids by "closest to the corner"
        state.orderedIds = calculatorsEntitySelectors.selectAll(state)
          .sort((c1, c2) => c1.position[0] + c1.position[1] - c2.position[0] - c2.position[1])
          .map((calc) => calc.id);
      }
      if (state.displayMode === 'grid') {
        // Set each position to the current grid position
        calculatorsEntitySelectors.selectAll(state).forEach((calc) => {
          const calcElement = document.getElementById(calc.id.toString());
          if (!calcElement) return;
          const rect = calcElement.getBoundingClientRect();
          calculatorsAdapter.updateOne(state, {
            id: calc.id,
            changes: { position: [rect.left, rect.top] },
          });
        });
      }
      state.displayMode = action.payload;
    },
    createCalculator: (state) => {
      createCalculator(state);
    },
    updateCalculator: (state, action: PayloadAction<{ calculatorId: EntityId, changes: Partial<Omit<Calculator, 'id'>> }>) => {
      const { calculatorId, changes } = action.payload;
      calculatorsAdapter.updateOne(state, { id: calculatorId, changes });
    },
    bringCalculatorToTop: (state, action: PayloadAction<{ calculatorId: EntityId }>) => {
      const { calculatorId } = action.payload;
      state.highestZIndex += 1;
      calculatorsAdapter.updateOne(state, {
        id: calculatorId,
        changes: { zIndex: state.highestZIndex },
      });
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
      const calculator = findCalculator(state, tabId);
      calculatorsAdapter.updateOne(state, { id: calculator.id, changes: { currentTab: tabId } });
    },
    updateTab: (state, action: PayloadAction<{ tabId: EntityId, changes: Partial<Omit<CalculatorTab, 'id'>> }>) => {
      const { tabId, changes } = action.payload;
      tabsAdapter.updateOne(state.tabs, { id: tabId, changes });
    },
    deleteTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      tabsAdapter.removeOne(state.tabs, tabId);
      const calculator = findCalculator(state, tabId);
      removeTabFromCalculator(state, calculator.id, tabId);
      if (calculatorsEntitySelectors.selectTotal(state) === 0) state.show = false;
    },
    copyTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      const tab = tabsEntitySelectors.selectById(state.tabs, tabId);
      const calculator = findCalculator(state, tab.id);
      const newTab = generateTab({
        name: `Copy of ${tab.name}`,
        mini: tab.mini,
        point1: tab.point1,
        point2: tab.point2,
        penalty: tab.penalty,
        speed: tab.speed,
      });
      tabsAdapter.addOne(state.tabs, newTab);
      calculatorsAdapter.updateOne(state, {
        id: calculator.id,
        changes: {
          currentTab: newTab.id,
          tabs: insertAfter(newTab.id, calculator.tabs, tab.id),
        },
      });
    },
    splitTab: (state, action: PayloadAction<{ tabId: EntityId }>) => {
      const { tabId } = action.payload;
      const tab = tabsEntitySelectors.selectById(state.tabs, tabId);
      const calculator = findCalculator(state, tabId);
      if (calculator.tabs.length <= 1) return;
      // Remove the tab from the old calculator
      removeTabFromCalculator(state, calculator.id, tab.id);
      // Create a new calculator with the tab
      const newCalculator = generateCalculator();
      newCalculator.tabs.push(tab.id);
      newCalculator.currentTab = tab.id;
      calculatorsAdapter.addOne(state, newCalculator);
      // The calculator's position should:
      // After the current one, order wise
      state.orderedIds = insertAfter(newCalculator.id, state.orderedIds, calculator.id);
      // Split moving the original to the left, and the new to the right, while both to top
      state.highestZIndex += 1;
      calculatorsAdapter.updateOne(state, {
        id: calculator.id,
        changes: {
          position: [
            calculator.position[0] - (calculatorWidth + calculatorSpacing * 8) / 2,
            calculator.position[1],
          ],
          zIndex: state.highestZIndex,
        },
      });
      state.highestZIndex += 1;
      calculatorsAdapter.updateOne(state, {
        id: newCalculator.id,
        changes: {
          position: [
            calculator.position[0] + (calculatorWidth + calculatorSpacing * 8) / 2,
            calculator.position[1],
          ],
          zIndex: state.highestZIndex,
        },
      });
    },
    // Screenshots
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
    // Dragging
    handleDragStart: (state, action: PayloadAction<{ activeId: EntityId }>) => {
      const { activeId } = action.payload;
      state.dragging = activeId;
      if (isTabId(activeId)) {
        const calculator = findCalculator(state, activeId);
        calculatorsAdapter.updateOne(state, {
          id: calculator.id,
          changes: { currentTab: activeId },
        });
      }
    },
    handleDragOver: (state, action: PayloadAction<{ activeId: EntityId, overId?: EntityId }>) => {
      const { activeId, overId } = action.payload;
      if (!overId || !isTabId(activeId)) return;
      const calculator = findCalculator(state, activeId);
      const overCalculator = isCalculatorId(overId)
        ? calculatorsEntitySelectors.selectById(state, overId)
        : findCalculator(state, overId);
      if (calculator.id === overCalculator.id) return;
      // Remove from the old calculator
      removeTabFromCalculator(state, calculator.id, activeId);
      // Add it to the new calculator
      calculatorsAdapter.updateOne(
        state,
        {
          id: overCalculator.id,
          changes: {
            tabs: insertAfter(activeId, overCalculator.tabs, overId),
            currentTab: activeId,
          },
        },
      );
    },
    handleDragEnd: (
      state,
      action: PayloadAction<{ activeId: EntityId, overId?: EntityId, delta?: [number, number] }>,
    ) => {
      const { activeId, overId, delta } = action.payload;
      if (isTabId(activeId)) {
        state.dragging = null;
        if (!overId || overId === activeId) return;
        const calculator = findCalculator(state, activeId);
        const oldIndex = calculator.tabs.indexOf(activeId);
        const newIndex = calculator.tabs.indexOf(overId);
        calculatorsAdapter.updateOne(state, {
          id: calculator.id,
          changes: { tabs: arrayMove(calculator.tabs, oldIndex, newIndex) },
        });
      }
      if (isCalculatorId(activeId)) {
        if (state.displayMode === 'grid') {
          const oldIndex = state.orderedIds.indexOf(activeId);
          const newIndex = overId ? state.orderedIds.indexOf(overId) : state.orderedIds.length;
          state.orderedIds = arrayMove(state.orderedIds, oldIndex, newIndex);
          return;
        }
        if (state.displayMode === 'free-drag' && delta) {
          const calculator = calculatorsEntitySelectors.selectById(state, activeId);
          calculatorsAdapter.updateOne(state, {
            id: activeId,
            changes: {
              position: [calculator.position[0] + delta[0], calculator.position[1] + delta[1]],
            },
          });
        }
      }
    },
  },
});

// Exports -------------------------------------------------------------------
export default calculatorsSlice.reducer;
export const calculatorsActions = calculatorsSlice.actions;
export const calculatorsSelectors = {
  show: (state: RootState) => state.calculators.show,
  displayMode: (state: RootState) => state.calculators.displayMode,
  getCalculator: createSelector(
    [
      (state: RootState) => state.calculators,
      (state: RootState, calculatorId: EntityId) => calculatorId,
    ],
    (calculators, calculatorId) => calculatorsEntitySelectors.selectById(calculators, calculatorId),
  ),
  getCalculatorIds: createSelector(
    [(state: RootState) => state.calculators],
    (calculators) => calculators.orderedIds,
  ),
  getTab: createSelector(
    [
      (state: RootState) => state.calculators.tabs,
      (state: RootState, tabId: EntityId) => tabId,
    ],
    (tabs, tabId) => tabsEntitySelectors.selectById(tabs, tabId),
  ),
  getTabActive: createSelector(
    [
      (state: RootState) => state.calculators,
      (state: RootState, tabId: EntityId) => tabId,
    ],
    (calculators, tabId) => calculatorsEntitySelectors
      .selectAll(calculators)
      .some((c) => c.currentTab === tabId),
  ),
  // Screenshots
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
  // Dragging
  getDragging: (state: RootState) => state.calculators.dragging,
};
