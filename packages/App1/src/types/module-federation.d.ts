declare module 'app2/app' {
  const App: React.ComponentType<any>;
  export default App;
}

declare module 'app2/sharedComponents' {
  export const ComponentOne: React.ComponentType<any>;
  export const ComponentTwo: React.ComponentType<any>;
  export function sharingFunction(): void;
}

declare module 'viteapp/app' {
  const App: React.ComponentType<any>;
  export default App;
} 