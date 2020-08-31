import {
    IsNumber,
    MaxLength,
    IsNumberString,
    ValidateIf
} from "class-validator";

export class PostAddComment {

    @IsNumberString(undefined, {
        message: "boardListCardId必须为数字"
    })
    boardListCardId: number;

    @MaxLength(1000, {
        message: "最大评论数字不能超过1000字符"
    })
    content:string
}

export class GetComment {

    @ValidateIf( o => o.page != undefined )
    @IsNumberString(undefined, {
        message: "页码必须为数字"
    })
    page?: number;

    @IsNumberString(undefined, {
        message: "boardListCardId必须为数字"
    })
    boardListCardId: number;

}