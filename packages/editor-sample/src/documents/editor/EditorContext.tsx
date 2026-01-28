import { create } from 'zustand';

import getConfiguration, { getConfigurationAsync } from '../../getConfiguration';

import { TEditorConfiguration } from './core';

type TValue = {
  document: TEditorConfiguration;
  isLoading: boolean;
  loadError: string | null;

  selectedBlockId: string | null;
  selectedSidebarTab: 'block-configuration' | 'styles';
  selectedMainTab: 'editor' | 'preview' | 'json' | 'html';
  selectedScreenSize: 'desktop' | 'mobile';

  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
};

const editorStateStore = create<TValue>(() => ({
  document: getConfiguration(window.location.hash),
  isLoading: false,
  loadError: null,
  selectedBlockId: null,
  selectedSidebarTab: 'styles',
  selectedMainTab: 'editor',
  selectedScreenSize: 'desktop',

  inspectorDrawerOpen: true,
  samplesDrawerOpen: true,
}));

// Load template from API if needed
const hash = window.location.hash;
if (hash.startsWith('#template/')) {
  editorStateStore.setState({ isLoading: true });
  getConfigurationAsync(hash)
    .then((config) => {
      editorStateStore.setState({ document: config, isLoading: false, loadError: null });
    })
    .catch((error) => {
      editorStateStore.setState({
        isLoading: false,
        loadError: error.message || 'Failed to load template',
      });
    });
}

export function useDocument() {
  return editorStateStore((s) => s.document);
}

export function useSelectedBlockId() {
  return editorStateStore((s) => s.selectedBlockId);
}

export function useSelectedScreenSize() {
  return editorStateStore((s) => s.selectedScreenSize);
}

export function useSelectedMainTab() {
  return editorStateStore((s) => s.selectedMainTab);
}

export function setSelectedMainTab(selectedMainTab: TValue['selectedMainTab']) {
  return editorStateStore.setState({ selectedMainTab });
}

export function useSelectedSidebarTab() {
  return editorStateStore((s) => s.selectedSidebarTab);
}

export function useInspectorDrawerOpen() {
  return editorStateStore((s) => s.inspectorDrawerOpen);
}

export function useSamplesDrawerOpen() {
  return editorStateStore((s) => s.samplesDrawerOpen);
}

export function setSelectedBlockId(selectedBlockId: TValue['selectedBlockId']) {
  const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
  const options: Partial<TValue> = {};
  if (selectedBlockId !== null) {
    options.inspectorDrawerOpen = true;
  }
  return editorStateStore.setState({
    selectedBlockId,
    selectedSidebarTab,
    ...options,
  });
}

export function setSidebarTab(selectedSidebarTab: TValue['selectedSidebarTab']) {
  return editorStateStore.setState({ selectedSidebarTab });
}

export function resetDocument(document: TValue['document']) {
  return editorStateStore.setState({
    document,
    selectedSidebarTab: 'styles',
    selectedBlockId: null,
  });
}

export function setDocument(document: TValue['document']) {
  const originalDocument = editorStateStore.getState().document;
  return editorStateStore.setState({
    document: {
      ...originalDocument,
      ...document,
    },
  });
}

export function toggleInspectorDrawerOpen() {
  const inspectorDrawerOpen = !editorStateStore.getState().inspectorDrawerOpen;
  return editorStateStore.setState({ inspectorDrawerOpen });
}

export function toggleSamplesDrawerOpen() {
  const samplesDrawerOpen = !editorStateStore.getState().samplesDrawerOpen;
  return editorStateStore.setState({ samplesDrawerOpen });
}

export function setSelectedScreenSize(selectedScreenSize: TValue['selectedScreenSize']) {
  return editorStateStore.setState({ selectedScreenSize });
}

export function useIsLoading() {
  return editorStateStore((s) => s.isLoading);
}

export function useLoadError() {
  return editorStateStore((s) => s.loadError);
}

export async function loadTemplateFromHash(hash: string) {
  editorStateStore.setState({ isLoading: true, loadError: null });
  try {
    const config = await getConfigurationAsync(hash);
    editorStateStore.setState({ document: config, isLoading: false, loadError: null });
  } catch (error) {
    editorStateStore.setState({
      isLoading: false,
      loadError: error instanceof Error ? error.message : 'Failed to load template',
    });
  }
}
