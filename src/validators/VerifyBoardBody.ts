import { IsNotEmpty, MaxLength, ValidateIf } from "class-validator";
import Boom from "@hapi/boom";
import { BoardModel } from "../models/BoardModel";

export class PostAddBoardBody {
    @IsNotEmpty({
        message: '面板名称不能为空'
    })
    @MaxLength(255, {
        message: '面板名称不能超过255个字节'
    })
    name: string
}

export class PutUpdateBoardBody {
    // 代表用户更新面板的数字如果不等 undefined那么就继续进行下面的判断
    @ValidateIf(o => o.name !== undefined)
    @MaxLength(255, {
        message: '面板名称不能大于255个字符'
    })
    name?: string
}

/**
 * @param id 面板id
 * @param userId 用户id
 */
export async function getValidateBoard (id: number, userId: number): Promise<BoardModel> {

    // findByPk 返回的是一个表中的一列数据，并且这列数据是对象的形式
    let board = await BoardModel.findByPk(id);

    if (!board) {
        throw Boom.notFound("当前看板不存在");
    }
    if (board.userId !== userId) {
        throw Boom.forbidden("你没有该面板的权限");
    }

    return board;
}

