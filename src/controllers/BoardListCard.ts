import {
    Ctx,
    Controller,
    Post,
    Body,
    Delete,
    Put,
    Get,
    Flow,
    Query,
    Params
} from "koa-ts-controllers";
import authorization from "../middlewares/authorization";
import { Context } from "koa";
import { PostAddCardVerify, GetCardsVerify, PostUpdateCardVerify, getValidateBoardListCard } from "../validators/VerifyBoardListCard";
import { getValidateBoardList } from "../validators/VerifyBoardList"
import { BoardListCardModel } from "../models/BoardListCardModel"

@Controller("/card")
@Flow([authorization])
export class BoardListCardController {

    /**
     * 创建卡片
     */
    @Post('')
    public async addCard (
        @Ctx() ctx: Context,
        @Body() body: PostAddCardVerify
    ) {
        let { boardListId, name, description } = body;

        await getValidateBoardList(boardListId, ctx.userInfo.id)

        let newBoardListCard = new BoardListCardModel();
        newBoardListCard.userId = ctx.userInfo.id;
        newBoardListCard.boardListId = boardListId;
        newBoardListCard.name = name;
        newBoardListCard.description = description;

        newBoardListCard.save();

        return newBoardListCard;
    }

    /**
     * 获取所有卡片
     */
    @Get('')
    public async getCards (
        @Ctx() ctx: Context,
        @Query("") query: GetCardsVerify
    ) {
        let { boardListId } = query;

        await getValidateBoardList(boardListId, ctx.userInfo.id);

        let cardArr = await BoardListCardModel.findAll({
            where: {
                boardListId,
                userId: ctx.userInfo.id
            },
            order:[
                ['id', 'asc']
            ]
        });

        return cardArr;
    }

    /**
     * 获取某个卡片
     */
    @Get('/:id(\\d+)')
    public async getCard (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardListCard = await getValidateBoardListCard(id, ctx.userInfo.id);

        return boardListCard;
    }

    /**
     * 更新某个卡片
     */
    @Put('/:id(\\d+)')
    public async updateCard (
        @Ctx() ctx: Context,
        @Params('id') id: number,
        @Body() body: PostUpdateCardVerify
    ) {
        let { boardListId, name, description, order } = body;

        let boardListCard = await getValidateBoardListCard(id, ctx.userInfo.id);

        boardListCard.boardListId = boardListId || boardListCard.boardListId;
        boardListCard.name = name || boardListCard.name;
        boardListCard.description = description || boardListCard.description;
        boardListCard.order = order || boardListCard.order;

        await boardListCard.save();

        ctx.status = 204;
        return;
    }

    /**
     * 删除卡片
     */
    @Delete('/:id(\\d+)')
    public async deleteCard (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {
        let boardListCard = await getValidateBoardListCard(id, ctx.userInfo.id);
        
        await boardListCard.destroy();

        ctx.status = 204;
        return;
    }
    
}