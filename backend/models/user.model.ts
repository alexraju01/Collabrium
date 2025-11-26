import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

type Roles = 'project manager' | 'line manager' | 'user';

// User attributes interface
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Roles;
}

// 2. Define the attributes required for creation (ID is optional)
export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare confirmPassword: string;
  declare role: Roles;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Username is required',
        },
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 character',
        },
        is: {
          args: /^[a-zA-Z0-9._]+$/i,
          msg: 'Username can only contain letters, numbers, dots, and underscores',
        },
      },
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Invalid email format' },
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [8, 255],
          msg: 'Password must be at least 8 characters long',
        },
      },
    },

    confirmPassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Confirm password is required' },

        passwordMatches(value: string) {
          if (value !== this.password) {
            // Sequelize will catch this error and prevent saving/updating
            throw new Error('Password and Confirm Password must match.');
          }
        },
      },
    },

    role: {
      type: DataTypes.ENUM('project manager', 'line manager', 'user'),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['project manager', 'line manager', 'user']],
          msg: 'Invalid role',
        },
      },
    },
  },
  {
    sequelize,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    // hooks: {
    //   // Hash password before creating user
    //   beforeCreate: async (user: User) => {
    //     if (user.password) {
    //       const salt = await bcrypt.genSalt(10);
    //       user.password = await bcrypt.hash(user.password, salt);
    //     }
    //   },
    //   // Hash password before updating user if password is modified
    //   beforeUpdate: async (user: User) => {
    //     if (user.changed('password')) {
    //       const salt = await bcrypt.genSalt(10);
    //       user.password = await bcrypt.hash(user.password, salt);
    //     }
    //   },
    // },
  },
);

export default User;
