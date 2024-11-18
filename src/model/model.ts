import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

const sequelize = new Sequelize('mysql://username:password@localhost:3306/your_database');

interface JobAttributes {
  id: number;
  description: string;
  paid: boolean;
  price: number;
  paymentDate?: Date;
  contractorId: number;
  clientId: number;
}

type JobCreationAttributes = Optional<JobAttributes, 'id' | 'paymentDate' | 'paid'>;

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public description!: string;
  public paid!: boolean;
  public price!: number;
  public paymentDate!: Date;
  public contractorId!: number;
  public clientId!: number;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: { type: DataTypes.STRING, allowNull: false },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    paymentDate: { type: DataTypes.DATE, allowNull: true },
    contractorId: { type: DataTypes.INTEGER, allowNull: false },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Job' }
);

interface ProfileAttributes {
  id: number;
  balance: number;
}

type ProfileCreationAttributes = Optional<ProfileAttributes, 'id'>;

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public balance!: number;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  },
  { sequelize, modelName: 'Profile' }
);

enum ContractStatus { 
    new = 'new',
    IN_PROGRESS = 'in_progress',
    TERMINATED = 'terminated'
}

interface ContractAttributes {
    id: number;
    terms: string,
    status: ContractStatus
}

type ContractCreationAttributes = Optional<ContractAttributes, 'id'>;

class Contract extends Model<ContractAttributes, ContractCreationAttributes> {
    public id!: number;
    public terms!: string;
    public status!: ContractStatus
}


Contract.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    terms: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    status:{
      type: DataTypes.ENUM(...Object.values(ContractStatus)),
      allowNull: false,
      defaultValue: ContractStatus.new
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Contract.belongsTo(Profile, {as: 'Contractor'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
Contract.belongsTo(Profile, {as: 'Client'})
Contract.hasMany(Job)
Job.belongsTo(Contract)

export { sequelize, Job, Profile };
