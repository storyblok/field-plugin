import { bold, cyan, yellow, red } from "kleur/colors";
import prompts from "prompts";
import { resolve, dirname } from "path";
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from "fs";
import Mustache from "mustache";
import walk from "walkdir";
import { FIELD_PLUGINS_PATH, REPO_ROOT_DIR } from "./const";

export type GenerateArgs = {
  packageName?: string;
  template?: string;
};

export type GenerateFunc = (args: GenerateArgs) => Promise<void>;

export const TEMPLATES = [
  {
    title: "Vue 2",
    // description: 'some description if exists',
    value: "vue2",
  },
];

async function askPackageName() {
  const { packageName } = await prompts(
    [
      {
        type: "text",
        name: "packageName",
        message:
          "What is your project name?\n  (Lowercase alphanumeric and dash are allowed.)",
        validate: (name) => new RegExp(/^[a-z0-9\\-]+$/).test(name),
      },
    ],
    {
      onCancel: () => {
        process.exit(1);
      },
    }
  );
  return packageName;
}

async function selectTemplate() {
  const { template } = await prompts(
    [
      {
        type: "select",
        name: "template",
        message: "Which template?",
        choices: TEMPLATES,
      },
    ],
    {
      onCancel: () => {
        process.exit(1);
      },
    }
  );
  return template;
}

export const generate: GenerateFunc = async (args) => {
  console.log(bold(cyan("\nWelcome!")));
  console.log("Let's create a field-type extension.\n");

  const packageName = args.packageName || (await askPackageName());
  const template = args.template || (await selectTemplate());

  const destPath = resolve(REPO_ROOT_DIR, FIELD_PLUGINS_PATH, packageName);
  const templatePath = resolve(process.cwd(), "templates", template) + "/";

  if (!existsSync(templatePath)) {
    console.log(
      bold(red("[ERROR]")),
      `The template '${template}' is not found.`
    );
    process.exit(1);
  }

  walk.sync(templatePath, (file, stat) => {
    if (!stat.isFile()) {
      return;
    }

    const destFilePath = resolve(destPath, file.slice(templatePath.length));
    mkdirSync(dirname(destFilePath), {
      recursive: true,
    });
    if (file.endsWith(".mustache")) {
      const newFilePath = destFilePath.slice(
        0,
        destFilePath.length - ".mustache".length
      );
      writeFileSync(
        newFilePath,
        Mustache.render(readFileSync(file).toString(), {
          packageName,
        })
      );
    } else {
      copyFileSync(file, destFilePath);
    }
  });

  console.log(`\nRunning \`yarn install\`..\n`);
  const { execaCommandSync } = await import("execa");
  console.log(execaCommandSync("yarn install").stdout);
  console.log(bold(cyan(`\n\nYour project \`${packageName}\` is ready 🚀\n`)));
  console.log(`- To run development mode:`);
  console.log(`    >`, yellow(`yarn workspace ${packageName} dev`));
};
