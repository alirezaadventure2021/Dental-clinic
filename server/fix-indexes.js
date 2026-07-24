const sequelize = require("./config/database");

async function fixIndexes() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");

    // Show current indexes on users table
    const [indexes] = await sequelize.query("SHOW INDEX FROM users");
    console.log("\nCurrent indexes on users table:");
    console.log("Total indexes:", indexes.length);
    indexes.forEach((idx) => {
      console.log(
        `  - ${idx.Key_name} (${idx.Column_name}) - ${idx.Non_unique === 0 ? "UNIQUE" : "INDEX"}`,
      );
    });

    // Get unique index names (excluding PRIMARY)
    const uniqueIndexes = indexes.filter(
      (idx) => idx.Non_unique === 0 && idx.Key_name !== "PRIMARY",
    );

    console.log("\nUnique indexes to potentially drop:");
    uniqueIndexes.forEach((idx) => {
      console.log(`  - ${idx.Key_name}`);
    });

    // Drop duplicate unique indexes on email (keep only one)
    const emailIndexes = uniqueIndexes.filter(
      (idx) => idx.Column_name === "email",
    );
    if (emailIndexes.length > 1) {
      console.log(
        "\nFound",
        emailIndexes.length,
        "unique indexes on email. Dropping extras...",
      );
      for (let i = 1; i < emailIndexes.length; i++) {
        const dropSQL = `DROP INDEX \`${emailIndexes[i].Key_name}\` ON users`;
        console.log("Running:", dropSQL);
        await sequelize.query(dropSQL);
      }
    }

    // Also check for any other duplicate indexes
    const indexNames = indexes.map((idx) => idx.Key_name);
    const duplicateNames = indexNames.filter(
      (name, i) => indexNames.indexOf(name) !== i,
    );
    const uniqueDuplicates = [...new Set(duplicateNames)];

    if (uniqueDuplicates.length > 0) {
      console.log("\nFound duplicate index names:", uniqueDuplicates);
      for (const name of uniqueDuplicates) {
        const dropSQL = `DROP INDEX \`${name}\` ON users`;
        console.log("Running:", dropSQL);
        await sequelize.query(dropSQL);
      }
    }

    // Show final index count
    const [finalIndexes] = await sequelize.query("SHOW INDEX FROM users");
    console.log("\nFinal index count:", finalIndexes.length);

    console.log("\nDone! Try restarting the server.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

fixIndexes();
