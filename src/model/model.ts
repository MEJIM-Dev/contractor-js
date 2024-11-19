import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USERNAME = 'user', DB_PASSWORD, DB_LOGGING, DB_NAME = 'db' } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: DB_LOGGING === undefined ? false : DB_LOGGING === 'true',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export enum ProfileType {
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
}

interface ProfileAttributes {
  id: number;
  balance: number;
  firstName: string;
  lastName: string;
  profession: string;
  type: ProfileType;
  password: string;
  email: string;
}

export type ProfileCreationAttributes = Optional<ProfileAttributes, 'id' | 'profession'>;

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public balance!: number;
  public firstName!: string;
  public lastName!: string;
  public profession!: string;
  public type!: ProfileType;
  public password!: string;
  public email!: string;
}

Profile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    profession: { type: DataTypes.STRING, allowNull: true },
    type: {
      type: DataTypes.ENUM(...Object.values(ProfileType)),
      allowNull: false,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: 'Profile' }
);

// ---------- Contract Model ----------

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated',
  PAID = "paid"
}

interface ContractAttributes {
  id: number;
  terms: string;
  status: ContractStatus;
  ContractorId: number; // Foreign key from Profile
  ClientId: number; // Foreign key from Profile
}

export type ContractCreationAttributes = Optional<ContractAttributes, 'id'>;

class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: number;
  public terms!: string;
  public status!: ContractStatus;
  public ContractorId!: number;
  public ClientId!: number;
}

Contract.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    terms: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(ContractStatus)),
      allowNull: false,
      defaultValue: ContractStatus.NEW,
    },
    ContractorId: { type: DataTypes.INTEGER, allowNull: false },
    ClientId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Contract' }
);

interface JobAttributes {
  id: number;
  description: string;
  paid: boolean;
  price: number;
  paymentDate?: Date;
  contractorId: number; // Foreign key from Profile
  clientId: number; // Foreign key from Profile
  ContractId: number; // Foreign key from Contract
}

export type JobCreationAttributes = Optional<JobAttributes, 'id' | 'paymentDate' | 'paid'>;

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public description!: string;
  public paid!: boolean;
  public price!: number;
  public paymentDate!: Date;
  public contractorId!: number;
  public clientId!: number;
  public ContractId!: number;
}

Job.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    paymentDate: { type: DataTypes.DATE, allowNull: true },
    contractorId: { type: DataTypes.INTEGER, allowNull: false },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    ContractId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Job' }
);

// Profile has many Contracts (as Contractor)
Profile.hasMany(Contract, { as: 'ContractorContracts', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor', foreignKey: 'ContractorId' });

// Profile has many Contracts (as Client)
Profile.hasMany(Contract, { as: 'ClientContracts', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client', foreignKey: 'ClientId' });

// Contract has many Jobs
Contract.hasMany(Job, { foreignKey: 'ContractId' });
Job.belongsTo(Contract, { foreignKey: 'ContractId' });

// Profile has many Jobs (as Contractor)
Profile.hasMany(Job, { as: 'ContractorJobs', foreignKey: 'contractorId' });
Job.belongsTo(Profile, { as: 'Contractor', foreignKey: 'contractorId' });

// Profile has many Jobs (as Client)
Profile.hasMany(Job, { as: 'ClientJobs', foreignKey: 'clientId' });
Job.belongsTo(Profile, { as: 'Client', foreignKey: 'clientId' });

export { sequelize, Profile, Contract, Job };

// import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
// import dotenv from "dotenv";
// dotenv.config();

// const { DB_HOST, DB_USERNAME = "user", DB_PASSWORD, DB_LOGGING, DB_NAME="db" } = process.env;

// const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
//   host: DB_HOST, 
//   dialect: 'mysql',  
//   logging: DB_LOGGING==undefined ? false : DB_LOGGING=="true" ? true : false,    
//   pool: {
//       max: 5,        
//       min: 0,     
//       acquire: 30000,
//       idle: 10000  
//   }
// });

// interface JobAttributes {
//   id: number;
//   description: string;
//   paid: boolean;
//   price: number;
//   paymentDate?: Date;
//   contractorId: number;
//   clientId: number;
// }

// export type JobCreationAttributes = Optional<JobAttributes, 'id' | 'paymentDate' | 'paid'>;

// class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
//   public id!: number;
//   public description!: string;
//   public paid!: boolean;
//   public price!: number;
//   public paymentDate!: Date;
//   public contractorId!: number;
//   public clientId!: number;

//   public Contract?: Contract;
// }

// Job.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     description: { type: DataTypes.STRING, allowNull: false },
//     paid: { type: DataTypes.BOOLEAN, defaultValue: false },
//     price: { type: DataTypes.FLOAT, allowNull: false },
//     paymentDate: { type: DataTypes.DATE, allowNull: true },
//     contractorId: { type: DataTypes.INTEGER, allowNull: false },
//     clientId: { type: DataTypes.INTEGER, allowNull: false },
//   },
//   { sequelize, modelName: 'Job' }
// );

// export enum ProfileType { 
//     CLIENT = 'client',
//     CONTRACTOR = 'contractor'
// }

// interface ProfileAttributes {
//   id: number;
//   balance: number;
//   firstName: string;
//   lastName: string;
//   profession: string;
//   type: ProfileType;
//   password: string;
//   email: string
// }

// export type ProfileCreationAttributes = Optional<ProfileAttributes, 'id' | "profession">;

// class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
//   public id!: number;
//   public balance!: number;
//   public firstName!: string;
//   public lastName!: string;
//   public profession!: string;
//   public type!: ProfileType;
//   public password!: string;
//   public email!: string;
// }

// Profile.init(
//   {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       balance: { 
//         type: DataTypes.FLOAT, 
//         allowNull: false, defaultValue: 0 
//       },
//       type: {
//         type: DataTypes.ENUM(...Object.values(ProfileType)),
//         allowNull: false,
//       },
//       firstName: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//       },
//       lastName: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//       },
//       profession: {
//         type: DataTypes.STRING, 
//         allowNull: true 
//       },
//       password: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//       }, 
//       email: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//       },
//   },
//   { sequelize, modelName: 'Profile' }
// );

// enum ContractStatus { 
//     NEW = 'new',
//     IN_PROGRESS = 'in_progress',
//     TERMINATED = 'terminated'
// }

// interface ContractAttributes {
//     id: number;
//     terms: string,
//     status: ContractStatus
// }

// export type ContractCreationAttributes = Optional<ContractAttributes, 'id'>;

// class Contract extends Model<ContractAttributes, ContractCreationAttributes> {
//     public id!: number;
//     public terms!: string;
//     public status!: ContractStatus
// }


// Contract.init(
//   {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     terms: { 
//         type: DataTypes.STRING, 
//         allowNull: false 
//     },
//     status:{
//       type: DataTypes.ENUM(...Object.values(ContractStatus)),
//       allowNull: false,
//       defaultValue: ContractStatus.NEW
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Contract'
//   }
// );

// // Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
// // Contract.belongsTo(Profile, {as: 'Contractor'})
// // Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
// // Contract.belongsTo(Profile, {as: 'Client'})
// // Contract.hasMany(Job)
// // Job.belongsTo(Contract)

// Profile.hasMany(Contract, { as: 'ContractorContracts', foreignKey: 'ContractorId' });
// Contract.belongsTo(Profile, { as: 'Contractor', foreignKey: 'ContractorId' });

// Profile.hasMany(Contract, { as: 'ClientContracts', foreignKey: 'ClientId' });
// Contract.belongsTo(Profile, { as: 'Client', foreignKey: 'ClientId' });

// Contract.hasMany(Job, { as: 'Jobs', foreignKey: 'ContractId' });
// Job.belongsTo(Contract, { as: 'Contract', foreignKey: 'ContractId' });


// export { sequelize, Job, Profile, Contract };
