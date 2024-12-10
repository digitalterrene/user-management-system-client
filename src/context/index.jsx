import { create } from "zustand";

export const useCounter = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
export const useCreateNewOrEditOld = create((set) => ({
  isCreatingNew: true,
  togleIsCreatingNew: () =>
    set((state) => ({ isCreatingNew: !state.isCreatingNew })),
}));
export const useHandleCreateNewOrEditOldInputs = create((set) => ({
  inputs: {},
  updateInputs: (newInputs) => set((state) => ({ inputs: { ...newInputs } })),
}));
export const useToggleSidebar = create((set) => ({
  toggleSidebarState: true,
  toggleSidebar: () =>
    set((state) => ({ toggleSidebarState: !state.toggleSidebarState })),
}));
