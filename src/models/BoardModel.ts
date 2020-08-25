import {
    Table,
    Model,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    PrimaryKey,
    ForeignKey,
    Column,
    DataType
} from "sequelize-typescript";
import { UserModel } from "./UserModel"

@Table({
    tableName: "board"
})
export class BoardModel extends Model<BoardModel> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    // 关联 UserModel模型中的主键
    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    userId: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}