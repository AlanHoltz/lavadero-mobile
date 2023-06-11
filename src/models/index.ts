import { JsonSQLite } from "@capacitor-community/sqlite";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { ServiceModel } from "./Service";
import { ServiceTypeModel } from "./ServiceTypes";
import { EmployeeModel } from "./Employee";
import { EmployeeEarningsModel } from "./EmployeeEarnings";
import { WorkDaysModel } from "./WorkDays";
import { WorkDayEmployeeEarningsModel } from "./WorkDayEmployeeEarnings";
import { WorkDayEarningsByServiceTypesModel } from "./WorkDayEarningsByServiceTypes";
import { formatDate } from "../utils/general";
import { Capacitor } from '@capacitor/core';

const SIMULATED_FK = false;

const INITIALIZE_DATABASE_QUERY = `
INSERT INTO service_types VALUES ('Pequeño',2500),('Mediano', 2800),('Grande', 3200),('Extra', 4000);
INSERT INTO employees VALUES ('Néstor',1),('Brian',0);
INSERT INTO employee_earnings VALUES ('Néstor','Extra',550),('Brian','Extra',550),('Néstor','Pequeño',400),('Néstor','Mediano',450),('Néstor','Grande',500),('Brian','Pequeño',400),('Brian','Mediano',450),('Brian','Grande',500);
`;

//INSERT INTO work_days VALUES ('2023-02-21', 2,2,2,2),('2023-02-28',2,2,2,2), ('2023-03-02', 2,2,2,2);
//INSERT INTO services VALUES ('2023-02-27 13:01', 'Servicio 1', NULL, 'Pequeño', NULL, NULL);
//INSERT INTO services VALUES ('2023-02-26 14:30','Corsa 150', NULL,'Grande',NULL,NULL),('2023-02-26 14:31','Corsa 200', NULL,'Pequeño',NULL,NULL),('2023-02-26 15:30','Chevi 200', NULL,'Grande',NULL,NULL),('2023-02-26 16:00','Corsa 200', NULL,'Pequeño',NULL,NULL);
//INSERT INTO employees VALUES ('Néstor',1),('Brian',0);


const initializeDatabase = async (db: SQLiteDBConnection) => {
  try {
    await db.execute(INITIALIZE_DATABASE_QUERY);
  } catch (err: any) {
    throw err;
  };
};



const lavaderoJSON: JsonSQLite = {
  database: "Lavadero",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "service_types",
      schema: [
        {
          column: "service_type_name",
          value: "TEXT PRIMARY KEY NOT NULL",
        },
        {
          column: "service_type_price",
          value: "REAL NOT NULL"
        }
      ],
      triggers: [
        {
          name: "service_types_after_delete",
          timeevent: "AFTER DELETE",
          condition: "",
          logic: `
          BEGIN 
          DELETE FROM services 
          WHERE service_type_name = old.service_type_name 
          AND 
          date(service_datetime) = '${formatDate(new Date(), "%Y-%M-%D")}';
          ${!Capacitor.isNativePlatform() && SIMULATED_FK ? "DELETE FROM employee_earnings WHERE service_type_name = old.service_type_name;" : ""}
          END;`
        },
        {
          name: "service_types_after_insert",
          timeevent: "AFTER INSERT",
          condition: "",
          logic: `
          BEGIN 
          INSERT INTO employee_earnings 
          (employee_name,service_type_name,current_earnings) 
          SELECT employee_name, new.service_type_name, 550 FROM employees;
          END;`
        },

      ]
    },
    {
      name: "employees",
      schema: [
        {
          column: "employee_name",
          value: "TEXT PRIMARY KEY NOT NULL",
        },
        {
          column: "employee_privileged",
          value: "INTEGER NOT NULL"
        }
      ],
      triggers: [
        {
          name: "employees_after_delete_any_employee",
          timeevent: "AFTER DELETE",
          condition: "",
          logic: `
          BEGIN 
          UPDATE services SET service_made_by = (SELECT employee_name FROM employees LIMIT 1) WHERE
          date(service_datetime) = '${formatDate(new Date(), "%Y-%M-%D")}'; 
          ${!Capacitor.isNativePlatform() && SIMULATED_FK ? "DELETE FROM employee_earnings WHERE employee_name = old.employee_name;" : ""}
          END;`
        },
        {
          name: "employees_after_delete_privileged_employee",
          timeevent: "AFTER DELETE",
          condition: "WHEN old.employee_privileged = 1",
          logic: `
          BEGIN 
          UPDATE employees SET employee_privileged = 1 WHERE employee_name != old.employee_name;
          END;`
        },
        {
          name: "employees_after_insert",
          timeevent: "AFTER INSERT",
          condition: "WHEN new.employee_privileged = 1",
          logic: `
          BEGIN
          UPDATE employees SET employee_privileged = 0 WHERE employee_name != new.employee_name;
          END;
          `
        },
        {
          name: "employees_after_update_no_privileged_employee",
          timeevent: "AFTER UPDATE",
          condition: "WHEN old.employee_privileged = 0 AND new.employee_privileged = 1",
          logic: `
          BEGIN
          UPDATE employees SET employee_privileged = 0 WHERE employee_name != new.employee_name;
          END;
          `
        },
        {
          name: "employees_after_update_privileged_employee",
          timeevent: "AFTER UPDATE",
          condition: "WHEN old.employee_privileged = 1 AND new.employee_privileged = 0",
          logic: `
          BEGIN 
          UPDATE employees SET employee_privileged = 1 WHERE employee_name = (SELECT employee_name FROM employees WHERE employee_name != new.employee_name LIMIT 1);
          END;`
        },

      ]
    },
    {
      name: "services",
      schema: [
        {
          column: "service_datetime",
          value: "TEXT NOT NULL",
        },
        {
          column: "service_name",
          value: "TEXT NOT NULL",
        },
        {
          column: "service_client_phone",
          value: "TEXT NULL"
        },
        {
          column: "service_type_name",
          value: "TEXT NOT NULL",
        },
        {
          column: "service_special_price",
          value: "REAL NULL"
        },
        {
          column: "service_made_by",
          value: "TEXT NULL",
        },
        {
          constraint: "PK_service_name_datetime",
          value: "PRIMARY KEY (service_name,service_datetime)",
        },
        {
          foreignkey: "service_type_name",
          value: "REFERENCES service_types (service_type_name) ON DELETE NO ACTION ON UPDATE NO ACTION"
        },
        {
          foreignkey: "service_made_by",
          value: "REFERENCES employees (employee_name) ON DELETE NO ACTION ON UPDATE NO ACTION"
        }
      ]
    },
    {
      name: "employee_earnings",
      schema: [
        {
          column: "employee_name",
          value: "TEXT NOT NULL",
        },
        {
          column: "service_type_name",
          value: "TEXT NOT NULL",

        },
        {
          column: "current_earnings",
          value: "REAL NOT NULL"
        },
        {
          constraint: "PK_employee_name_service_type",
          value: "PRIMARY KEY (employee_name,service_type_name)"
        },
        {
          foreignkey: "employee_name",
          value: "REFERENCES employees (employee_name) ON DELETE CASCADE ON UPDATE CASCADE"
        },
        {
          foreignkey: "service_type_name",
          value: "REFERENCES service_types (service_type_name) ON DELETE CASCADE ON UPDATE CASCADE"
        },
      ]
    },
    {
      name: "work_days",
      schema: [
        {
          column: "work_date",
          value: "TEXT PRIMARY KEY NOT NULL",
        },
        {
          column: "box_closed_on",
          value: "REAL NOT NULL"
        },
        {
          column: "box_real_value",
          value: "REAL NOT NULL"
        },
        {
          column: "services_total_price",
          value: "REAL NOT NULL",
        },
        {
          column: "employee_earnings_total",
          value: "REAL NOT NULL",
        }
      ],
      triggers: [],
    },
    {
      name: "work_day_employee_earnings",
      schema: [
        {
          column: "employee_name",
          value: "TEXT NOT NULL",
        },
        {
          column: "work_date",
          value: "TEXT NOT NULL",
        },
        {
          column: "earnings",
          value: "REAL NOT NULL"
        },
        {
          constraint: "PK_employee_name_work_date",
          value: "PRIMARY KEY (employee_name,work_date)"
        },
        {
          foreignkey: "employee_name",
          value: "REFERENCES employees (employee_name) ON DELETE NO ACTION ON UPDATE CASCADE"
        }, {
          foreignkey: "work_date",
          value: "REFERENCES work_days (work_date) ON DELETE CASCADE ON UPDATE CASCADE"
        }
      ]
    },
    {
      name: "work_day_earnings_by_service_types",
      schema: [{
        column: "work_date",
        value: "TEXT NOT NULL",
      }, {
        column: "service_type",
        value: "TEXT NOT NULL",
      },
      {
        column: "price",
        value: "REAL NOT NULL",

      },
      {
        constraint: "PK_work_date_service_type",
        value: "PRIMARY KEY (work_date,service_type)"
      },
      {
        foreignkey: "work_date",
        value: "REFERENCES work_days (work_date) ON DELETE CASCADE ON UPDATE CASCADE"
      }
      ]
    },

  ],


};

if (!Capacitor.isNativePlatform() && SIMULATED_FK) {
  lavaderoJSON.tables[1].triggers?.push(
    {
      name: "employees_after_update_any_employee",
      timeevent: "AFTER UPDATE",
      condition: "",
      logic: `
      BEGIN
      UPDATE employee_earnings SET employee_name = new.employee_name WHERE employee_name = old.employee_name;
      END;
      `
    }
  );

  lavaderoJSON.tables[0].triggers?.push(
    {
      name: "service_types_after_update_any_service_type",
      timeevent: "AFTER UPDATE",
      condition: "",
      logic: `
      BEGIN
      UPDATE employee_earnings SET service_type_name = new.service_type_name WHERE service_type_name = old.service_type_name;
      END;
      `
    }
  );

  lavaderoJSON.tables[4].triggers?.push(
    {
      name: "work_day_after_delete",
      timeevent: "AFTER DELETE",
      condition: "",
      logic: `
      BEGIN
      DELETE FROM work_day_employee_earnings WHERE work_date = old.work_date;
      DELETE FROM work_day_earnings_by_service_types WHERE work_date = old.work_date;
      END;
      `
    }
  );
};

const deleteDatabase = async () => {
  try {
    const db = await sqlite.createConnection("Lavadero");
    await db.delete();
  } catch (err: any) {
    throw err;
  }
  finally {
    await sqlite.closeConnection("Lavadero");
  };
};

const createDatabaseIfNotExists = async () => {

  try {
    const databaseExists = (await sqlite.isDatabase('Lavadero')).result;
    if (!databaseExists) {
      await sqlite.importFromJson(JSON.stringify(lavaderoJSON));
      const db: SQLiteDBConnection = await sqlite.createConnection("Lavadero");
      await db.open();
      await initializeDatabase(db);
    };
  }
  catch (err: any) {
    throw err;
  }
  finally {
    const connExists = await sqlite.isConnection("Lavadero");
    if (connExists.result) await sqlite.closeConnection("Lavadero");
  };
};

const importDatabase = async (lavaderoJSON: any) => {
  try {
    await deleteDatabase();
    await sqlite.importFromJson(lavaderoJSON)
  }
  catch (err: any) {
    throw err;
  };
};

export { createDatabaseIfNotExists, importDatabase, deleteDatabase, WorkDaysModel, WorkDayEarningsByServiceTypesModel, WorkDayEmployeeEarningsModel, ServiceModel, ServiceTypeModel, EmployeeModel, EmployeeEarningsModel };