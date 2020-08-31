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
    UpdatedAt,
} from "sequelize-typescript";
import { UserModel } from "./UserModel";
import { BoardListCardModel } from "./BoardListCardModel"
import { AttachmentModel } from "./AttachmentModel"

@Table({
    tableName: "CardAttachment"
})
export class CardAttachmentModel extends Model {

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

    @ForeignKey(() => BoardListCardModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    boardListCardId: number;

    @ForeignKey(() => AttachmentModel)
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
    })
    attachmentId: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    isCover: boolean;

    @BelongsTo(() => AttachmentModel)
    detail: AttachmentModel;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
