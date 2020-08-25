import { IsNumberString, Min, IsNotEmpty, MaxLength, ValidateIf } from "class-validator";
import Boom from "@hapi/boom";
import { BoardListCardModel } from "../models/BoardListCardModel"

export class GetCardsVerify {
    @IsNumberString({}, {
        message: "boardListId不能为空且必须为数字"
    })
    boardListId: number;
}

export class PostAddCardVerify {

    @Min(1, {
        message: "boardListId不能为空且必须是大于1的数字"
    })
    boardListId: number;

    @IsNotEmpty({
        message: "名称不能为空"
    })
    @MaxLength(255, {
        message: "卡片名称不能超过255个字符"
    })
    name: string;

    @ValidateIf( o => o.description !== undefined)
    @MaxLength(2000, {
        message: "卡片描述不能超过2000个字符"
    })
    description: string;
}

export class PostUpdateCardVerify {

    @ValidateIf( o => o.boardListId !== undefined)
    @Min(1, {
        message: "boardListId不能为空且必须是大于1的数字"
    })
    boardListId?: number;

    @ValidateIf( o => o.name !== undefined)
    @MaxLength(255, {
        message: "卡片名称不能超过255个字符"
    })
    name?: string;

    @ValidateIf( o => o.description !== undefined )
    @MaxLength(2000, {
        message: "卡片描述不能超过2000个字符"
    })
    description?: string;

    @ValidateIf( o => o.order !== undefined )
    @IsNumberString({}, {
        message: "order必须为数字"
    })
    order?: number;
}

/**
 * 
 * @param id 面板中某一个列表卡片的id
 * @param userId 当前用户登录的 id
 */
export async function getValidateBoardListCard (id: number, userId: number): Promise<BoardListCardModel> {

    // findByPk 返回的是一个表中的一列数据，并且这列数据是一个实例对象的形式
    let boardListCard = await BoardListCardModel.findByPk(id);

    if (!boardListCard) {
        throw Boom.notFound("当前卡片不存在");
    }
    if (boardListCard.userId !== userId) {
        throw Boom.forbidden("你没有该卡片的权限");
    }

    return boardListCard;
}

