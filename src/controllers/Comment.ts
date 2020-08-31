import {
    Ctx,
    Flow,
    Post,
    Get,
    Controller,
    Body,
    Query,
} from "koa-ts-controllers";
import authorization from "../middlewares/authorization";
import { Context } from "koa";
import { PostAddComment, GetComment } from "../validators/VerifyComment";
import { CommentModel } from "../models/CommentModel";
import { UserModel } from "../models/UserModel";

@Controller("/comment")
@Flow([authorization])
export class CommentController {

    /**
     * 创建评论
     */
    @Post('')
    public async addComment ( 
        @Ctx() ctx:Context,
        @Body() body: PostAddComment
    ) {
        let { boardListCardId, content } = body;

        let newComment = new CommentModel;
        newComment.userId = ctx.userInfo.id;
        newComment.boardListCardId = boardListCardId;
        newComment.content = content;

        let currentUser = await UserModel.findOne({
            where: {
                id: newComment.userId
            },
            attributes: ['id', 'name']
        })

        await newComment.save();

        let newUser = JSON.parse(JSON.stringify(currentUser));
        let comment = JSON.parse(JSON.stringify(newComment));

        ctx.status = 201;

        return {
            user: newUser,
            ...comment
        };
    }


    /**
     * 获取评论
     * page: 页码
     * boardListCardId：卡片id
     */
    @Get('')
    public async getComment (
        @Ctx() ctx: Context,
        @Query() query: GetComment
    ) {

        let { page, boardListCardId } = query;

        // 查看 CommentModel模型中 where条件成立的 搜索数据库中的多个元素，同时返回数据总数
        let commentCount = await CommentModel.count({
            where: {
                boardListCardId,
            }
        })

        // 默认展示多少条数据
        let limit = 3;

        page = Number(page);
        if (!page) {
            page = 1;
        }
        page = Math.min(page, commentCount);
        page = Math.max(page, 1);

        let comment = await CommentModel.findAndCountAll({
            where: {
                boardListCardId,
            },
            limit,
            offset: (page - 1) * limit,
            order: [ ['id', 'desc'] ],
            include: [
                {
                    model: UserModel,
                    attributes: ['id', 'name']
                }
            ]
        })

        ctx.status = 201;
        return {
            boardListCardId,
            ...comment
        }
    }
}