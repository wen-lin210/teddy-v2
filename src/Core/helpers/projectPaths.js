import { resolve as resolvePath } from 'path';

const rootDir = process.cwd();

export const projectPaths = {
  rootDir,
  configMain: resolvePath(rootDir, 'settings', 'config.main.json'),
  appStateData: resolvePath(rootDir, '.data', 'appstate.json'),
  resourcesLyrics: resolvePath(rootDir, 'resources', 'Lyrics'),
  resourcesData: resolvePath(rootDir, 'resources', 'Data'),
};

export function fromRoot(...segments) {
  return resolvePath(rootDir, ...segments);
}

export default projectPaths;
