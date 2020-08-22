import { 
    IsNumberString,
    Min,
    IsNotEmpty,
    ValidateIf,
    IsNumber
} from "class-validator";
import { BoardListModel } from "../models/BoardListModel";
import Boom from "@hapi/boom";


export class GetListQuery {
    @IsNumberString(undefined, {
        message: '面板id不能为空且必须为数字'
    })
    boardId: number;
}

export class AddBoardList {
    @Min(1, {
        message: '面板id不能为空且必须为数字'
    })
    boardId: number;

    @IsNotEmpty({
        message: '列表名称不能为空'
    })
    name: string;
}

export class PutUpdateListBody {

    @ValidateIf( o => o.boardId !== undefined )
    @Min(1, {
        message: '面板id不能为空且必须为数字'
    })
    boardId: number;

    @ValidateIf( o => o.name !== undefined )
    @IsNotEmpty({
        message: '列表名称不能为空'
    })
    name: string;
    
    @ValidateIf(o=>o.order !== undefined)
    @IsNumber({}, {
        message: '请输入正确的排序数字'
    })
    order: number
}


/**
 * @param id 列表id
 * @param userId 用户id
 */
export async function getValidateBoardList (id: number, userId: number): Promise<BoardListModel> {

    // findByPk 返回的是一个表中的一列数据，并且这列数据是一个实例对象的形式
    let boardList = await BoardListModel.findByPk(id);

    if (!boardList) {
        throw Boom.notFound("当前列表不存在");
    }
    if (boardList.userId !== userId) {
        throw Boom.forbidden("你没有该列表的权限");
    }

    return boardList;
}