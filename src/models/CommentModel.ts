import {
    Table,
    Model,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt
} from "sequelize-typescript";
import {BoardListCardModel} from "./BoardListCardModel";
import { UserModel} from "./UserModel";

@Table({
    tableName: "comment"
})
export class CommentModel extends Model {

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

    @BelongsTo(() => UserModel)
    user: UserModel;

    @ForeignKey(() => BoardListCardModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    boardListCardId: number;

    @Column({
        type: DataType.STRING(2000),
        allowNull: false
    })
    content: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}