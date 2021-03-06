import {
    Model,
    Table,
    DataType,
    PrimaryKey,
    Column,
    AutoIncrement,
    ForeignKey,
    HasMany
} from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { BoardModel } from "./BoardModel"
import { BoardListCardModel } from "./BoardListCardModel"

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

    // 关联 BoardModel模型中的主键
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

    // cards 关联 BoardListCardModel模型，并且进行联查
    // HasMany : 在当前的面板中可以有很多的卡片，这就是一对多
    @HasMany(() => BoardListCardModel)
    cards: BoardListCardModel[]

    @Column
    createdAt: Date;

    @Column
    updatedAt: Date
}