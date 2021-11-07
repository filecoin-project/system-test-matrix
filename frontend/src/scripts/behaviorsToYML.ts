import parse from "csv-parse/lib/sync";
import fs from "fs";
import _ from "lodash";
import yaml from "yaml";
import util from "util";

const CSV_PATH = "src/scripts/behaviors.csv";
const OUTPUT_PATH = "src/scripts/behaviors.yml";

// Stupid key format (with spaces) is because airtable exports it like that
interface ICSVRow {
  "Scenario ID": string;
  "Feature Name": string;
  Behavior: string;
  "Last Modified": string;
  Created: string;
  Subsystem: string;
  "System (from Subsystem)": string;
}

// Output YML format
interface IOutputFormat {
  systems: Array<{
    name: string;
    subsystems: Array<{
      name: string;
      features: Array<{
        name: string;
        behaviors: Array<{
          id: string;
          description: string;
        }>;
      }>;
    }>;
  }>;
}

const format = (rows: ICSVRow[]) => {
  let result: any = {
    systems: {},
  };

  const rowsBySystem = _.groupBy(rows, "System (from Subsystem)");
  for (const systemName in rowsBySystem) {
    let subsystems: any = {};
    const rowsBySubsystem = _.groupBy(rowsBySystem[systemName], "Subsystem");

    for (const subsystemName in rowsBySubsystem) {
      let features: any[] = [];

      const rowsByFeature = _.groupBy(
        rowsBySubsystem[subsystemName],
        "Feature Name"
      );
      for (const featureName in rowsByFeature) {
        features.push({
          name: featureName,
          behaviors: rowsByFeature[featureName].map((r: ICSVRow) => ({
            id: r["Scenario ID"],
            description: r["Behavior"],
          })),
        });
      }

      subsystems[subsystemName] = {
        features,
      };
    }

    result.systems[systemName] = {
      subsystems,
    };
  }

  return result;
};

// Take the Airtable csv export and convert it into a well-formatted YML Behavior file
// This is a one-time script that won't be used after we transition away from Airtable
const convert = (csvPath: string, outputPath: string) => {
  const csvRows = parseCsv(csvPath);
  const formatted = format(csvRows);
  const yamlString = yaml.stringify(formatted);
  fs.writeFileSync(outputPath, yamlString);
};

const parseCsv = (path: string): ICSVRow[] => {
  const csvContents = fs.readFileSync(path);
  return parse(csvContents, {
    columns: true,
    skip_empty_lines: true,
    // ⚠️ if you don't specify this parameter you'll get a nasty bug
    // where some invisible whitespace is appended to the first key (spent an hour debugging)
    bom: true,
  });
};

// MAIN
convert(CSV_PATH, OUTPUT_PATH);

export {};
