"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("employees", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sickLeave: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    privilegeLeave: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    shortLeave: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("employees");
}
