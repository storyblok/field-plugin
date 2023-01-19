import { existsSync, readFileSync } from "fs";
import { bold, cyan, red, yellow, green } from "kleur/colors";
import { basename, resolve } from "path";
import prompts from "prompts";
import walk from "walkdir";
import { FIELD_PLUGINS_PATH, REPO_ROOT_DIR } from "./const";
import {
  createFieldType,
  fetchAllFieldTypes,
  updateFieldType,
} from "./field_types";
import { loadEnvironmentVariables } from "./utils";
import * as fs from "fs";

export type DeployArgs =
  | {
      fieldPluginName?: string;
      skipPrompts?: false;
    }
  | {
      fieldPluginName: string;
      skipPrompts: true;
    };

type DeployFunc = (args: DeployArgs) => Promise<void>;

export const deploy: DeployFunc = async ({ fieldPluginName, skipPrompts }) => {
  console.log(bold(cyan("\nWelcome!")));
  console.log("Let's deploy a field-plugin.\n");

  loadEnvironmentVariables();
  if (!process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN) {
    console.log(
      red("[ERROR]"),
      "Cannot find an environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`."
    );
    console.log(
      "Create .env file at the root of this repository and configure the variable."
    );
    process.exit(1);
  }

  const packageName =
    getPackageName(fieldPluginName) ?? (await selectPackage());

  console.log(bold(cyan(`[info] Building \`${packageName}\`...`)));
  const { execaCommandSync } = await import("execa");

  try {
    console.log(
      execaCommandSync(`yarn build ${packageName}`, {
        cwd: REPO_ROOT_DIR,
      }).stdout
    );
    console.log("");
  } catch (err) {
    console.log(err.message);
    console.log(red("[ERROR]"), "Build failed.");
    process.exit(1);
  }

  const outputPath = resolve(
    REPO_ROOT_DIR,
    FIELD_PLUGINS_PATH,
    packageName,
    "dist",
    "index.js"
  );
  if (!existsSync(outputPath)) {
    console.log(
      red("[ERROR]"),
      "The build output is not found at the following path:"
    );
    console.log(`  > ${outputPath}`);
    process.exit(1);
  }
  const output = readFileSync(outputPath).toString();

  console.log(bold(cyan("[info] Fetching field plugnis...")));
  const fieldTypes = await fetchAllFieldTypes();

  const matchingFieldType = fieldTypes.find(
    (fieldType) => fieldType.name === packageName
  );

  let result: boolean;
  if (matchingFieldType) {
    console.log(bold(cyan("[info] Found a matching field type.")));

    const mode = skipPrompts ? "update" : await selectUpsertMode();

    if (mode === "create") {
      const packageJsonPath = resolve(
        REPO_ROOT_DIR,
        FIELD_PLUGINS_PATH,
        packageName,
        "package.json"
      );
      console.log(
        bold(red("[ERROR]")),
        "You cannot create a new field type because the same name already exists."
      );
      console.log("You must rename the one in this repository first.");
      console.log(`  Rename \`name\` value at the following file:`);
      console.log(`  > ${packageJsonPath}`);
      process.exit(1);
    }

    result = await updateFieldType({
      id: matchingFieldType.id,
      field_type: {
        body: output,
      },
    });
  } else {
    console.log(
      bold(
        cyan(
          "[info] A matching field type is not found. So, we are creating a new field type on Storyblok."
        )
      )
    );

    const fieldType = await createFieldType(packageName);
    result = await updateFieldType({
      id: fieldType.id,
      field_type: {
        body: output,
      },
    });
  }

  if (result) {
    console.log(
      bold(green("[SUCCESS]")),
      "The field-type is deployed successfully."
    );
  } else {
    console.log(red("[ERROR]"), "Failed to deploy the field-type.");
  }
};

const getPackageName = (fieldPluginName?: string): string => {
  if (!fieldPluginName) {
    return;
  }

  const path = resolve(REPO_ROOT_DIR, FIELD_PLUGINS_PATH, fieldPluginName);

  if (!fs.lstatSync(path).isDirectory()) {
    return;
  }

  if (!isBuildable(path)) {
    return;
  }

  return fieldPluginName;
};

const selectPackage = async () => {
  const packages: string[] = [];
  walk.sync(
    resolve(REPO_ROOT_DIR, FIELD_PLUGINS_PATH),
    { max_depth: 1 },
    (path, stat) => {
      if (!stat.isDirectory()) {
        return;
      }

      if (!isBuildable(path)) {
        return;
      }
      packages.push(path);
    }
  );

  const { packageName } = prompts(
    [
      {
        type: "select",
        name: "packageName",
        message: "Which field-type?",
        choices: packages.map((path) => {
          const packageName = basename(path);
          return {
            title: packageName,
            value: packageName,
          };
        }),
      },
    ],
    {
      onCancel: () => {
        process.exit(1);
      },
    }
  );

  return packageName;
};

const selectUpsertMode = async () => {
  const { mode } = await prompts([
    {
      type: "select",
      name: "mode",
      message: "Update the existing field type?",
      choices: [
        {
          title: "Yes, update it.",
          value: "update",
        },
        {
          title: "No, create a new one.",
          value: "create",
        },
      ],
    },
  ]);
  return mode;
};

const isBuildable = (path: string) => {
  if (!existsSync(resolve(path, "package.json"))) {
    console.log(
      `[info] ${FIELD_PLUGINS_PATH}${yellow(
        basename(path)
      )} doesn't have \`package.json\`.`
    );
    return false;
  }

  const packageJson = JSON.parse(
    readFileSync(resolve(path, "package.json")).toString()
  );

  if (!packageJson.scripts?.build) {
    console.log(
      `[info] ${FIELD_PLUGINS_PATH}${yellow(
        basename(path)
      )}/package.json doesn't have \`build\` script.`
    );
    return false;
  }

  return true;
};
