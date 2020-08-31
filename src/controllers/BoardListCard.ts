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
import { 
    PostAddCardVerify, 
    GetCardsVerify, 
    PostUpdateCardVerify, 
    getValidateBoardListCard,
    getValidateCardAttachment,
    getValidateAttachment
} from "../validators/VerifyBoardListCard";
import { getValidateBoardList } from "../validators/VerifyBoardList"
import { BoardListCardModel } from "../models/BoardListCardModel";
import { CommentModel } from "../models/CommentModel";
import { CardAttachmentModel } from "../models/CardAttachmentModel";
import { AttachmentModel } from "../models/AttachmentModel";
import config from "../configs/index";
import Boom from "@hapi/boom";
import fs from "fs";

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
        newBoardListCard.description = description || '';

        await newBoardListCard.save();

        return {
            attachments: [],
            boardListId: newBoardListCard.boardListId,
            commentCount: 0,
            coverPath: "",
            description: "",
            createdAt: newBoardListCard.createdAt,
            updatedAt: newBoardListCard.updatedAt,
            id: newBoardListCard.id,
            name: newBoardListCard.name,
            order: 0,
            userId: ctx.userInfo.id,
        }
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
            ],
            include: [
                {
                    model: CommentModel,
                    attributes: ['id']
                },
                {
                    model: CardAttachmentModel,
                    include: [
                        {
                            model: AttachmentModel
                        }
                    ]
                }
            ]
        });

        let boardListCardsData = cardArr.map( (card: BoardListCardModel) => {
            // 处理附件的路径和封面
            let coverPath = '';
            let attachments = card.attachments.map( attachment => {
                let data = attachment.toJSON() as CardAttachmentModel & {path: string};
                data.path = config.storage.prefix + '/' + data.detail.name;

                if (data.isCover) {
                    coverPath = data.path;
                }

                return data;
            } );

            return {
                id: card.id,
                userId: card.userId,
                boardListId: card.boardListId,
                name: card.name,
                description: card.description,
                order: card.order,
                createdAt: card.createdAt,
                updatedAt: card.updatedAt,
                attachments: attachments,
                coverPath: coverPath,
                commentCount: card.comment.length
            }
        } );

        return boardListCardsData;
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

        console.log(boardListId, name);

        let boardListCard = await getValidateBoardListCard(id, ctx.userInfo.id);

        boardListCard.boardListId = boardListId || boardListCard.boardListId;
        boardListCard.name = name || boardListCard.name;
        boardListCard.description = description || boardListCard.description;
        boardListCard.order = order || boardListCard.order;

        await boardListCard.save();

        ctx.status = 201;
        return boardListCard;
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

    /**
     * 上传附件
     */
    @Post('/attachment')
    public async addAttachment (
        @Ctx() ctx: Context,
        @Body() body:any
    ) { 

        let { boardListCardId } = body;

        await getValidateBoardListCard(boardListCardId, ctx.userInfo.id);
        
        if (!ctx.request.files || !ctx.request.files.attachment) {
            throw Boom.badData("缺少附件")
        } 
        let file = ctx.request.files.attachment;

        let newAttachment = new AttachmentModel();
        newAttachment.userId = ctx.userInfo.id;
        newAttachment.size = file.size;
        newAttachment.type = file.type;
        newAttachment.originName = file.name;
        newAttachment.name = file.path.split("\\").pop() as string;
        await newAttachment.save();

        let newCardAttachment = new CardAttachmentModel();
        newCardAttachment.userId = newAttachment.userId;
        newCardAttachment.boardListCardId = boardListCardId;
        newCardAttachment.attachmentId = newAttachment.id;
        await newCardAttachment.save();

        return {
            id: newCardAttachment.id,
            userId: newCardAttachment.userId,
            boardListCardId: newCardAttachment.boardListCardId,
            attachmentId: newCardAttachment.id,
            path: config.storage.prefix + '/' + newAttachment.name,
            isCover: false,
            detail: newAttachment
        }
    } 

    /**
     * 删除附件
     */
    @Delete("/removeAttachment/:cardAttachmentId(\\d+)")
    public async removeAttachment (
        @Ctx() ctx: Context,
        @Params('cardAttachmentId') cardAttachmentId: number
    ) {

        let cardAttachment = await getValidateCardAttachment(cardAttachmentId, ctx.userInfo.id);

        let attachment = await getValidateAttachment(cardAttachment.attachmentId, ctx.userInfo.id);

        await cardAttachment.destroy();
        await attachment.destroy();

        fs.unlink(`./src/attachments/${attachment.name}`, err=>{
            if (err) return console.log(err);
            console.log("删除成功")
        });

        ctx.status = 204;
        return;
    }



    /**
     * 设置卡片封面
     * id: 设置卡片封面的附件 id: attachmentId
     */
    @Put('/attachment/cover/:id(\\d+)')
    public async setCover (
        @Ctx() ctx: Context,
        @Params('id') id: number,
    ) {

        let cardAttachment = await getValidateCardAttachment(id, ctx.userInfo.id);

        // 批量更新模型里面的所有isCover字段信息，并且还给了where 的筛选条件
        await CardAttachmentModel.update({
            isCover: false
        }, {
            where: {
                boardListCardId: cardAttachment.boardListCardId,
            }
        })

        cardAttachment.isCover = true;  
        await cardAttachment.save();  
        
        ctx.status = 204;
        return;
    }

    /**
     * 移除封面
     */
    @Delete('/attachment/cover/:id(\\d+)')
    public async removeCover (
        @Ctx() ctx: Context,
        @Params('id') id: number
    ) {

        let cardAttachment = await getValidateCardAttachment(id, ctx.userInfo.id);

        cardAttachment.isCover = false;
        await cardAttachment.save();

        ctx.status = 204;
        return;
    }
}