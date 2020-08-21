import { 
    IsNumberString,
    Min,
    IsNotEmpty,
    ValidateIf,
    IsNumber
} from "class-validator"


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