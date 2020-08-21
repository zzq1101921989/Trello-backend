import {
    Model,
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    Unique,
    AllowNull,
    DataType,
    CreatedAt,
    UpdatedAt
} from "sequelize-typescript";

const crypto = require('crypto');

// 关联的表名
@Table({
    tableName: "user"
})
// 模型对象映射表
export class UserModel extends Model<UserModel> {

    @PrimaryKey
    @AutoIncrement
    // Column 装饰器一定要放到最后面
    @Column
    id: number;

    @AllowNull
    @Unique
    @Column({
        type: DataType.STRING(50)
    })
    name: string;

    // 当用户注册密码的时候   newUser.password = 的时候触发
    @Column
    set password(val:string) {
        let md5 = crypto.createHash('md5');
        let password = md5.update(val).digest('hex');
        // 设置密码
        this.setDataValue('password', password)
    }

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}