import {
    Controller,
    Get,
    Ctx,
    Query,
    Params,
    Post,
    Body,
    Put,
    Delete
} from "koa-ts-controllers";
import { Context } from "koa";
import { GetListQuery, AddBoardList, PutUpdateListBody } from "../validators/VerifyBoardList";

@Controller("/list")
export class BoardListController {
    
    /**
     * 获取面板中的所有列表集合
     */
    @Get("")
    public async getAllBoardList (
        @Ctx() ctx: Context,
        @Query() query: GetListQuery
    ) {

    };

    /**
     * 获取面板中指定列表的详情
     */
    @Get("/:id(\\d+)")
    public async getDetailsBoardList (
        @Ctx() ctx: Context,
        @Params("id") id: number
    ) {

    };

    /**
     * 创建列表
     */
    @Post("")
    public async addBoardList (
        @Ctx() ctx: Context,
        @Body() body: AddBoardList
    ) {

    }

    /**
     * 更新列表
     */
    @Put("/:id(\\d+)")
    public async updateList (
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PutUpdateListBody
    ) {

    };

    /**
     * 删除列表
     */
    @Delete('/:id(\\d+)')
    public async deleteBoardList (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {

    }
}