import {
    Model,
    Table,
    DataType,
    PrimaryKey,
    Column,
    AutoIncrement,
    ForeignKey
} from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { BoardModel } from "./BoardModel"


@Table({
    tableName: "BoardList"
})
export class BoardListModel extends Model<BoardListModel> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    userId: number;

    @ForeignKey(() => BoardModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    boardId: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0
    })
    order: number;

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date
}