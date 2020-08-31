import {
    AutoIncrement, 
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { BoardListCardModel } from "./BoardListCardModel"
 
@Table({
    tableName: 'Attachment'
})
export class AttachmentModel extends Model {

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

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    originName: string;

    // @ForeignKey(() => BoardListCardModel)
    // @Column({
    //     type: DataType.INTEGER.UNSIGNED,
    //     allowNull: false
    // })
    // boardListCardId: number;

    // @BelongsTo(() => BoardListCardModel)
    // boardListCard: BoardListCardModel

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    })
    size: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    type: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}