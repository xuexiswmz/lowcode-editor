import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_PARENTS = ["Page", "Container", "Modal"];

function parseParents(value) {
  return value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function printHelp() {
  console.log(`Usage:
  npm run generate:material -- <name> [options]

Options:
  --name <text>         Material name, useful when using npm config style
  --desc <text>         Display name used in config.tsx
  --parents <list>      Comma-separated parent names, e.g. Page,Container,Modal
  --container           Generate a container component with drop support
  --dry-run             Print generated files without writing them
  --force               Overwrite an existing material directory
  --help                Show this help message

Examples:
  npm run generate:material -- ImageCard --desc 图片卡片
  npm run generate:material -- FormSection --container --parents Page,Container,Modal
  npm run generate:material -- --name=ImageCard --desc=图片卡片 --dry-run
`);
}

function normalizeName(input) {
  const cleaned = input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  if (!cleaned) {
    throw new Error("Material name is required.");
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(cleaned)) {
    throw new Error("Material name must resolve to PascalCase.");
  }

  return cleaned;
}

function parseArgs(argv) {
  const args = [...argv];
  const result = {
    name: process.env.npm_config_name ?? "",
    desc: process.env.npm_config_desc ?? "",
    parents: process.env.npm_config_parents
      ? parseParents(process.env.npm_config_parents)
      : [...DEFAULT_PARENTS],
    isContainer:
      process.env.npm_config_container === "true" ||
      process.env.npm_config_container === "",
    dryRun:
      process.env.npm_config_dry_run === "true" ||
      process.env.npm_config_dry_run === "",
    force:
      process.env.npm_config_force === "true" ||
      process.env.npm_config_force === "",
  };

  while (args.length > 0) {
    const arg = args.shift();
    if (!arg) {
      continue;
    }

    if (!arg.startsWith("--") && !result.name) {
      result.name = arg;
      continue;
    }

    if (!arg.startsWith("--") && result.name && !result.desc) {
      result.desc = arg;
      continue;
    }

    if (arg === "--container") {
      result.isContainer = true;
      continue;
    }

    if (arg === "--dry-run") {
      result.dryRun = true;
      continue;
    }

    if (arg === "--force") {
      result.force = true;
      continue;
    }

    if (arg === "--help") {
      printHelp();
      process.exit(0);
    }

    if (arg.startsWith("--name=")) {
      result.name = arg.slice("--name=".length);
      continue;
    }

    if (arg.startsWith("--desc=")) {
      result.desc = arg.slice("--desc=".length);
      continue;
    }

    if (arg.startsWith("--parents=")) {
      result.parents = parseParents(arg.slice("--parents=".length));
      continue;
    }

    if (arg === "--name") {
      result.name = args.shift() ?? "";
      continue;
    }

    if (arg === "--desc") {
      result.desc = args.shift() ?? "";
      continue;
    }

    if (arg === "--parents") {
      const value = args.shift() ?? "";
      result.parents = parseParents(value);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!result.name) {
    printHelp();
    throw new Error("Missing material name.");
  }

  if (result.parents.length === 0) {
    throw new Error("At least one parent is required.");
  }

  return result;
}

function createLeafDevTemplate(name) {
  return `import { useDrag } from "react-dnd";
import type { CommonComponentProps } from "../../interface";

export default function ${name}({ id, name, styles }: CommonComponentProps) {
  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  return (
    <div ref={drag} data-component-id={id} style={styles}>
      ${name}
    </div>
  );
}
`;
}

function createContainerDevTemplate(name) {
  return `import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../../interface";

const ${name} = ({ id, children, styles, name }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(id);
  const divRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, [drag, drop]);

  return (
    <div
      ref={divRef}
      data-component-id={id}
      style={styles}
      className={\`min-h-[120px] rounded-md border p-[20px] \${
        canDrop ? "border-blue-500 border-2" : "border-black border"
      }\`}
    >
      {children}
    </div>
  );
};

export default ${name};
`;
}

function createLeafProdTemplate(name) {
  return `import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";

const ${name} = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, styles }, ref) => {
    return (
      <div ref={ref} data-component-id={id} style={styles}>
        ${name}
      </div>
    );
  },
);

export default ${name};
`;
}

function createContainerProdTemplate(name) {
  return `import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";

const ${name} = forwardRef<HTMLDivElement, CommonComponentProps>(
  ({ id, children, styles }, ref) => {
    return (
      <div ref={ref} data-component-id={id} style={styles}>
        {children}
      </div>
    );
  },
);

export default ${name};
`;
}

function createConfigTemplate(name, desc, parents, isContainer) {
  const allowedParents = parents.map((item) => `"${item}"`).join(", ");
  return `import ${name}Dev from "./dev";
import ${name}Prod from "./prod";
import type { ComponentConfig } from "../types";

const config: ComponentConfig = {
  name: "${name}",
  desc: "${desc}",
  defaultProps: {},
  allowedParents: [${allowedParents}],
${isContainer ? "  isContainer: true,\n" : ""}  setter: [],
  stylesSetter: [],
  events: [],
  methods: [],
  dev: ${name}Dev,
  prod: ${name}Prod,
};

export default config;
`;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const name = normalizeName(options.name);
  const desc = options.desc || name;
  const materialDir = path.resolve("src", "materials", name);

  if ((await exists(materialDir)) && !options.force) {
    throw new Error(
      `Material "${name}" already exists. Use --force to overwrite it.`,
    );
  }

  const files = {
    "dev.tsx": options.isContainer
      ? createContainerDevTemplate(name)
      : createLeafDevTemplate(name),
    "prod.tsx": options.isContainer
      ? createContainerProdTemplate(name)
      : createLeafProdTemplate(name),
    "config.tsx": createConfigTemplate(
      name,
      desc,
      options.parents,
      options.isContainer,
    ),
  };

  if (options.dryRun) {
    console.log(`Dry run for ${name} -> ${materialDir}`);
    for (const [fileName, content] of Object.entries(files)) {
      console.log(`\n--- ${path.join(materialDir, fileName)} ---\n`);
      console.log(content);
    }
    return;
  }

  await mkdir(materialDir, { recursive: true });

  await Promise.all(
    Object.entries(files).map(([fileName, content]) =>
      writeFile(path.join(materialDir, fileName), content, "utf8"),
    ),
  );

  console.log(`Created material ${name}`);
  for (const fileName of Object.keys(files)) {
    console.log(`  - ${path.join(materialDir, fileName)}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
