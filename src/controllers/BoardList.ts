import {
    Controller,
    Get,
    Ctx,
    Query,
    Params,
    Post,
    Body,
    Put,
    Delete,
    Flow
} from "koa-ts-controllers";
import { Context } from "koa";
import { GetListQuery, AddBoardList, PutUpdateListBody, getValidateBoardList } from "../validators/VerifyBoardList";
import { getValidateBoard } from "../validators/VerifyBoardBody";
import authorization from "../middlewares/authorization";
import { BoardListModel } from "../models/BoardListModel";
import { BoardListCardModel } from "../models/BoardListCardModel"

@Controller("/list")
@Flow([authorization])
export class BoardListController {
    
    /**
     * 获取面板中的所有列表集合
     * 地址：/list?boardId=1
     */
    @Get("")
    public async getAllBoardList (
        @Ctx() ctx: Context,
        @Query() query: GetListQuery
    ) {
        let { boardId } = query;
        await getValidateBoard(boardId, ctx.userInfo.id)

        let list = BoardListModel.findAll({
            // 条件 ： WHERE boardId = boardId AND userId = 'ctx.userInfo.id'
            where: {
                boardId,
                userId: ctx.userInfo.id
            },
            // 包含 （联查）
            include: [BoardListCardModel],
            // 排序
            order: [
                ['order', 'asc']
            ]
        });

        return list;
    };

    /**
     * 获取面板中指定列表的详情
     * 地址：/list/1
     */
    @Get("/:id(\\d+)")
    public async getDetailsBoardList (
        @Ctx() ctx: Context,
        @Params("id") id: number
    ) {
        let boardList = await getValidateBoardList(id, ctx.userInfo.id);
        return boardList;
    };

    /**
     * 创建列表
     * 地址：/list
     * body { boardId,  name}
     */
    @Post("")
    public async addBoardList (
        @Ctx() ctx: Context,
        @Body() body: AddBoardList
    ) {
        let { boardId, name } = body;
        console.log(boardId);
        // 查询当前登录用户是否存在这个面板，从而确定用户是否拥有在这个面板建立列表的权利
        await getValidateBoard(boardId, ctx.userInfo.id)
        // 实例化一个数据表中的 列数据对象
        let newBoardList = new BoardListModel();
        // 取出最大order排序中打的那个数值最大的
        let maxOrderList = await BoardListModel.findOne({
            where: {
                boardId,
            },
            order: [
                ['order', 'desc']
            ]
        })

        // 列数据的各个字段的数据填充
        newBoardList.userId = ctx.userInfo.id;
        newBoardList.boardId = boardId;
        newBoardList.name = name;
        newBoardList.order = maxOrderList ? maxOrderList.order + 65535 : 65535;
        await newBoardList.save();

        ctx.status = 201;
        return newBoardList;
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
        let boardList = await getValidateBoardList(id, ctx.userInfo.id);

        let { boardId, name, order } = body;

        boardList.boardId = boardId || boardList.boardId;
        boardList.name = name || boardList.name;
        boardList.order = order || boardList.order;
        
        await boardList.save();
        
        ctx.status = 201;
        return boardList;
    };

    /**
     * 删除列表
     */
    @Delete('/:id(\\d+)')
    public async deleteBoardList (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardList = await getValidateBoardList(id, ctx.userInfo.id);
        boardList.destroy();

        ctx.status = 204;
        return {
            data: "删除成功"
        };
    }
}