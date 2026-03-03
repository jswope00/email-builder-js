var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
import getConfiguration, { getConfigurationAsync } from '../../getConfiguration';
const editorStateStore = create(() => ({
    document: getConfiguration(window.location.hash),
    isLoading: false,
    loadError: null,
    selectedBlockId: null,
    selectedSidebarTab: 'styles',
    selectedMainTab: 'editor',
    selectedScreenSize: 'desktop',
    inspectorDrawerOpen: true,
    samplesDrawerOpen: true,
    currentView: 'editor',
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
export function setSelectedMainTab(selectedMainTab) {
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
export function setSelectedBlockId(selectedBlockId) {
    const selectedSidebarTab = selectedBlockId === null ? 'styles' : 'block-configuration';
    const options = {};
    if (selectedBlockId !== null) {
        options.inspectorDrawerOpen = true;
    }
    return editorStateStore.setState(Object.assign({ selectedBlockId,
        selectedSidebarTab }, options));
}
export function setSidebarTab(selectedSidebarTab) {
    return editorStateStore.setState({ selectedSidebarTab });
}
export function resetDocument(document) {
    return editorStateStore.setState({
        document,
        selectedSidebarTab: 'styles',
        selectedBlockId: null,
    });
}
export function setDocument(document) {
    const originalDocument = editorStateStore.getState().document;
    return editorStateStore.setState({
        document: Object.assign(Object.assign({}, originalDocument), document),
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
export function setSelectedScreenSize(selectedScreenSize) {
    return editorStateStore.setState({ selectedScreenSize });
}
export function useCurrentView() {
    return editorStateStore((s) => s.currentView);
}
export function setCurrentView(currentView) {
    return editorStateStore.setState({ currentView });
}
export function useIsLoading() {
    return editorStateStore((s) => s.isLoading);
}
export function useLoadError() {
    return editorStateStore((s) => s.loadError);
}
export function loadTemplateFromHash(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        editorStateStore.setState({ isLoading: true, loadError: null });
        try {
            const config = yield getConfigurationAsync(hash);
            editorStateStore.setState({ document: config, isLoading: false, loadError: null });
        }
        catch (error) {
            editorStateStore.setState({
                isLoading: false,
                loadError: error instanceof Error ? error.message : 'Failed to load template',
            });
        }
    });
}
//# sourceMappingURL=EditorContext.js.map