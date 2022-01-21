import { SpawnOptions, spawnSync } from 'child_process';

const options: SpawnOptions = {
  stdio: 'inherit',
};

const build = () => {
  const command = 'npx';
  const args = ['tsc'];

  console.log([command].concat(args).join(' '));
  spawnSync(command, args, options);
};

export default build;
