import { mkdir, access, writeFile } from "node:fs/promises";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CATEGORY = "common";
const DEFAULT_PARENTS = ["Page", "Container", "Modal"];
const VALID_CATEGORIES = [
  "common",
  "navigation",
  "layout",
  "form",
  "display",
  "feedback",
];

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
  --desc <text>         Display name shown in the material panel
  --category <value>    Material category: ${VALID_CATEGORIES.join(", ")}
  --parents <list>      Comma-separated parent names, e.g. Page,Container,Modal
  --container           Generate a container material
  --dry-run             Print generated files without writing them
  --force               Overwrite an existing material directory
  --help                Show this help message

Examples:
  npm run generate:material -- EmptyState --desc 空状态
  npm run generate:material -- Stack --desc 堆叠布局 --category layout --container
  npm run generate:material -- --name=ActionCard --desc=操作卡片 --category=display --parents=Page,Container,Modal,Card
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
    category: process.env.npm_config_category ?? DEFAULT_CATEGORY,
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
    if (!arg) continue;

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

    if (arg.startsWith("--category=")) {
      result.category = arg.slice("--category=".length);
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

    if (arg === "--category") {
      result.category = args.shift() ?? "";
      continue;
    }

    if (arg === "--parents") {
      result.parents = parseParents(args.shift() ?? "");
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!result.name) {
    printHelp();
    throw new Error("Missing material name.");
  }

  if (!VALID_CATEGORIES.includes(result.category)) {
    throw new Error(
      `Invalid category "${result.category}". Expected one of: ${VALID_CATEGORIES.join(", ")}.`,
    );
  }

  if (result.parents.length === 0) {
    throw new Error("At least one parent is required.");
  }

  return result;
}

function createMaterialTemplate({ name, desc, category, parents, isContainer }) {
  const allowedParents = parents.map((item) => `"${item}"`).join(", ");
  const factoryImport = isContainer
    ? "createContainerMaterial"
    : "createLeafMaterial";
  const rendererName = `${name}Renderer`;
  const editorRendererName = `${name}EditorRenderer`;
  const editorFlag = isContainer ? "true" : "false";
  const previewBody = isContainer
    ? `  ({ id, children, styles }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      {children}
    </div>
  ),`
    : `  ({ id, text = "${desc}", styles }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      {text}
    </div>
  ),`;
  const editorBody = isContainer
    ? `  ({ id, children, styles }, ref) => (
    <div
      ref={ref}
      data-component-id={id}
      style={styles}
      className="min-h-[100px] rounded-md border border-black p-[20px]"
    >
      {children}
    </div>
  ),`
    : `  ({ id, text = "${desc}", styles }, ref) => (
    <div ref={ref} data-component-id={id} style={styles}>
      {text}
    </div>
  ),`;

  return `import { forwardRef } from "react";
import type { CommonComponentProps } from "../../interface";
import { createLeafMaterial, createContainerMaterial } from "../factories";

const ${rendererName} = forwardRef<HTMLDivElement, CommonComponentProps>(
${previewBody}
);

const ${editorRendererName} = forwardRef<HTMLDivElement, CommonComponentProps>(
${editorBody}
);

const ${name}Material = ${factoryImport}({
  name: "${name}",
  category: "${category}",
  desc: "${desc}",
  defaultProps: ${isContainer ? "{}" : `{ text: "${desc}" }`},
  allowedParents: [${allowedParents}],
${isContainer ? "  isContainer: true,\n" : ""}  setter: [],
  stylesSetter: [],
  events: [],
  methods: [],
  render: ${rendererName},
  renderInEditor: ${editorRendererName},
});

export default ${name}Material;
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
    "material.tsx": createMaterialTemplate({
      name,
      desc,
      category: options.category,
      parents: options.parents,
      isContainer: options.isContainer,
    }),
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
