// To Create Sequelize Cli Model run this
// npx sequelize-cli model:generate --name <model-name> --attributes firstName:string,lastName:string,email:string
//Sequelize model example
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class institutions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  institutions.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER(1),
        comment: "0 = DISABLE, 1 = ENABLE",
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "institutions",
      tableName: "institutions",
      paranoid: true,
    }
  );
  return institutions;
};

//Sequelize Operator use in condition and FindOne
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const institute = await Institution.findOne({
  where: {
    [Op.or]: [{ name: params.name }, { email: params.email }],
  },
});

//Sequelize Create
const institution = await Institution.create({
  name: params.name,
  email: params.email,
  address: params.address,
  phone: params.phone,
  password: params.password,
}).catch((err) => {
  console.log(err);
});

//Sequelize Delete
const deletedPost = await Post.destroy({
  where: {
    id: postId,
  },
});

//Sequelize Restore
const restoredPost = await Post.restore({
  where: {
    id: postId,
  },
});

//Sequelize Update
const updatedPost = await Post.update(
  {
    title: title,
    body: body,
    slug: slug,
    keywords: JSON.stringify(keywords),
    categoryId: categoryId,
  },
  {
    where: {
      id: postId,
    },
  }
);

//Sequelize force delete
const forceDeletedPost = await Post.destroy({
  where: {
    id: postId,
  },
  force: true,
});

//Sequelize Force Find
const forceFindCategoryById = async (id) => {
  const result = await Category.findOne({
    where: {
      id: id,
      deletedAt: {
        [Op.ne]: null,
      },
    },
    paranoid: false,
  });
  return result;
};

//Pagination get all
const { pagination } = require("pagination-express");
const getAllPostsPagination = async (req, res) => {
  // const allPosts = await Post.findAll({ offset: 5 * (pageNo - 1), limit: 5 });

  // res.json(await parseJson(allPosts));

  const { page, limit } = req.query;

  // you can use all sequelize ORM query here........
  const query = {
    // attributes: ["firstName", "lastName"],
    where: {
      status: 1,
    },
  };

  const option = {
    req: req,
    page: page,
    limit: 5, // give a limit
    metatags: "paginationInfo", // Optional for change default name of metatags
    lists: "allPosts", // Optional for change default name of list
    range: 5,
  };

  pagination(Post, option, { ...query }, async (response) => {
    await parseJson(response.allPosts);
    res.json({ payload: response });
  });
};

//Sequelize Connection without Cli
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "mysql",
});
//Testing Authentication
try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
//Close Connection
sequelize.close();

//Sequelize Register
const userRegister = async (req, res) => {
  const { firstName, lastName, email, password, address, phoneNo, image } =
    req.query;
  if (!email || !password) {
    return res.json({ status: false, message: "missing field" });
  }
  const result = await User.findOne({
    where: {
      email: email,
    },
  });
  if (result)
    return res.json({
      status: false,
      message: "User already registered with this email",
    });

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const createdUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword,
    address: address,
    phoneNo: phoneNo,
    image: image,
  }).catch((err) => {
    console.log(err);
  });
  res.json(createdUser);
  //res.json({msg: "register successfull"})
};

//Sequelize Login
const userLogin = async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    return res.json({ status: false, message: "missing field" });
  }

  const result = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!result)
    return res.json({
      status: false,
      message: "User not found with this email",
    });

  const validPass = await bcrypt.compare(password, result.password);
  if (!validPass)
    return res.status(400).json({ status: false, message: "invalid password" });
  //if(result.jwt) return res.status(400).json({status:false, message: "User already Logged in"})

  const dataForJsonWebToken = {
    id: result.id,
    name: result.name,
    time: new Date(),
  };

  // create a json web token || without giving expiry time  --> if needed then give . No problem
  const jsontoken = jwt.sign(dataForJsonWebToken, process.env.TOKEN_SECRET, {});

  const user = {
    id: result.id,
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    address: result.address,
    phoneNo: result.phoneNo,
    image: result.image,
    score: result.score,
    status: result.status,
  };
  await User.update(
    { jwt: jsontoken },
    {
      where: {
        id: result.id,
      },
    }
  );
  res.json({
    status: true,
    message: "Successfully login",
    user,
    accessToken: jsontoken,
  });
};
