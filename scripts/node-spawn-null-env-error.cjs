const { spawnSync } = require("child_process");

try {
  spawnSync(process.execPath, ["-e", "console.log('child started')"], {
    env: {
      PATH: process.env.PATH,
      SystemRoot: process.env.SystemRoot,
      BAD_ENV_VALUE: "x\0y",
    },
    stdio: "inherit",
  });
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}
