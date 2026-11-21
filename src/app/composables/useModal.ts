import type { Component } from 'vue';

export function useModal<T extends Component>(component: T) {
   return useOverlay().create(component);
}
