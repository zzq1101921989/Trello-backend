import {
    Model,
    Table,
    AutoIncrement,
    PrimaryKey,
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey
} from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { BoardListModel } from "./BoardListModel";

@Table({
    tableName: "BoardListCard"
})
export class BoardListCardModel extends Model {

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

    // 关联 BoardListModel模型中的主键
    @ForeignKey(() => BoardListModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    boardListId: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false,
        defaultValue: ''
    })
    description: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    })
    order: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
} 