import {
    Controller,
    Ctx,
    Post,
    Get,
    Params,
    Body,
    Put,
    Delete,
    Flow
} from "koa-ts-controllers"
import { Context } from "koa";
import { PostAddBoardBody, PutUpdateBoardBody, getValidateBoard } from "../validators/VerifyBoardBody"
import authorization from "../middlewares/authorization"
import { BoardModel } from "../models/BoardModel";

@Controller("/board")
@Flow([authorization])
export class BoardController {

    /**
     * 创建面板接口
     */
    @Post('')
    public async addBoard (
        @Ctx() ctx: Context,
        @Body() body: PostAddBoardBody
    ) {

        let board = new BoardModel();

        board.name = body.name;
        board.userId = ctx.userInfo.id;
        await board.save();

        ctx.status = 201;
        return board
    };

    /**
     * 获取当前用户的所有模板
     */
    @Get("")
    public async getBoards (
        @Ctx() ctx: Context
    ) {
        // 获取的条件
        let where = {
            userId: ctx.userInfo.id
        }
        // 获取到的所有面板
        let boards = await BoardModel.findAll({
            where
        })
        // 返回
        return boards;
    };

    /**
     * 获取一个面板的详情信息
     */
    @Get("/:id(\\d+)")
    public async getBoardDetalis (
        @Ctx() ctx: Context,
        @Params("id") id: number
    ) { 
        let board = await getValidateBoard(id, ctx.userInfo.id);
        return board;
    };

    /**
     * 更新一个面板
     */
    @Put("/:id(\\d+)")
    public async updateBoard (
        @Ctx() ctx: Context,
        @Params("id") id: number,
        @Body() body: PutUpdateBoardBody
    ) {
        let board = await getValidateBoard(id, ctx.userInfo.id);

        // 更新
        board.name = body.name || board.name;
        await board.save();

        ctx.status = 204;
    };

    /**
     * 删除一个面板
     */
    @Delete('/:id(\\d+)')
    public async deleteBoard(
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let board = await getValidateBoard(id, ctx.userInfo.id);

        // 删除
        await board.destroy();

        ctx.status = 204;
    }
}